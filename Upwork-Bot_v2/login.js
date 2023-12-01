import dotenv from "dotenv";
import os from "os";
import path from "path";
import puppeteerExtra from "puppeteer-extra";
import puppeteerExtraPluginStealth from "puppeteer-extra-plugin-stealth";
import { click } from "puppeteer-utilz";
import { evaluate, wait } from "./utils.js";
import {
    findJob,
    getAvailableEmail,
    removeAccount,
    saveJob,
    updateStatus,
} from "./firebase/firebase.js";
import getBidMessage from "./getBidMessage.js";

export const input = async (page, selector, key, time = 0) => {
    await page.waitForSelector(selector);
    return await page.type(selector, key, { delay: time });
};

const stealth = puppeteerExtraPluginStealth();
puppeteerExtra.use(stealth);
stealth.enabledEvasions.delete("iframe.contentWindow");
dotenv.config();
let AUTH = {
    token: "",
    oauth: "",
    uid: "",
    oDeskUserID: "",
};
const MODE = process.env.BID_MODE;

const DISABLE_COUNTRY = ["India", "Pakistan", "Bangladesh", "Korea"];

async function getAuthData(cookies) {
    const authData = {
        token: "",
        oauth: "",
        uid: "",
        oDeskUserID: "",
    };
    const authDetails = await cookies["cookies"]();
    for (const details of authDetails) {
        if (details.name === "XSRF-TOKEN") {
            authData.token = details.value;
        }

        if (details.name === "oauth2_global_js_token") {
            authData.oauth = details.value;
        }

        if (details.name === "user_uid") {
            authData.uid = details.value;
        }

        if (details.name === "console_user") {
            authData.oDeskUserID = details.value;
        }
    }
    return authData;
}

const apply = async (page, proposal) => {
    const disintermediationUrl =
        "https://www.upwork.com/ab/proposals/api/disintermediation/apply";
    const applyUrl = "https://www.upwork.com/ab/proposals/api/v2/application/new";
    AUTH = await getAuthData(page);
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        Authorization: `Bearer ${AUTH.oauth}`,
        "Content-Type": "application/json",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "x-odesk-csrf-token": AUTH.token,
        "x-odesk-user-agent": "oDesk LM",
        "x-requested-with": "XMLHttpRequest",
        "X-Upwork-Accept-Language": "en-US",
    };
    await evaluate(page, disintermediationUrl, headers);
    const response = await evaluate(
        page,
        applyUrl,
        headers,
        JSON.stringify(proposal)
    );
    return response;
};

const getNewJob = async (page) => {
    let apiEndpoint;
    if (MODE === "0") apiEndpoint = process.env.SEARCH_API;
    else if (MODE === "1")
        apiEndpoint = "https://www.upwork.com/ab/find-work/api/feeds/embeddings-recommendations?paging=0%3B10";

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        Authorization: `Bearer ${AUTH.oauth}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "x-odesk-user-agent": "oDesk LM",
        "x-requested-with": "XMLHttpRequest",
        "X-Upwork-Accept-Language": "en-US",
    };
    const response = await evaluate(page, apiEndpoint, headers,null);
    if (MODE === "0")
        return {
            title: response.searchResults.jobs[0].title,
            description: response.searchResults.jobs[0].description,
            jobId: response.searchResults.jobs[0].ciphertext,
        };
    else if (MODE === "1")
        return {
            title: response.results[0].title,
            description: response.results[0].description,
            jobId: response.results[0].ciphertext,
        };
};

const getJobDetail = async (page, jobId) => {
    const jobDetailUrl = `https://www.upwork.com/ab/proposals/api/openings/${jobId}`;
    const proposalDetailUrl = `https://www.upwork.com/ab/proposals/api/v4/job/details/${jobId}`;
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        Authorization: `Bearer ${AUTH.oauth}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "x-odesk-user-agent": "oDesk LM",
        "x-requested-with": "XMLHttpRequest",
        "X-Upwork-Accept-Language": "en-US",
    };

    const jobData = await evaluate(page, jobDetailUrl, headers);
    const proposalData = await evaluate(page, proposalDetailUrl, headers);
    const bidMessage = await getBidMessage(jobData.opening.job.description);
    const proposal = {
        version: 3,
        jobReference: jobData.opening.job.openingUid,
        agency: null,
        chargedAmount:
            jobData.opening.job.budget.amount > 0 &&
                jobData.opening.job.budget.amount < process.env.MIN_BUDGET
                ? 0
                : jobData.opening.job.budget.amount,
        coverLetter: bidMessage,
        earnedAmount: null,
        estimatedDuration: null,
        occupationUID: null,
        portfolioItemUids: [],
        attachments: [],
        questions: [],
        milestones: [],
        readyToStartDate: null,
        selectedContractor: {
            uid: AUTH.uid,
            oDeskUserID: AUTH.oDeskUserID,
        },
        profileRateToSet: false,
        boostBidAmount: 50,
        rateGuidance: null,
        agencyOrgUid: null,
    };

    if (
        jobData.opening.job.budget.amount > 0 &&
        jobData.opening.job.budget.amount < 1000
    )
        proposal.sri = { percent: 0, frequency: 0 };
    else if (
        jobData.opening.job.budget.amount > 1000 &&
        jobData.opening.job.budget.amount < 5000
    )
        proposal.estimatedDuration =
            jobData.opening.job.engagementDuration ||
            proposalData.context.engagementDurationsList[
            proposalData.context.engagementDurationsList.length - 1
            ];
    if (proposalData.jobDetails.questions) {
        proposal.questions = [];
        for (const question of proposalData.jobDetails.questions) {
            proposal.questions.push({
                ...question,
                answer: "Let's discuss details in a call or chatting",
            });
        }
    }
    return proposal;
};

const filterJob = async (page, jobId) => {
    const url = `https://www.upwork.com/ab/proposals/api/openings/${jobId}`;
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        Authorization: `Bearer ${AUTH.oauth}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "x-odesk-user-agent": "oDesk LM",
        "x-requested-with": "XMLHttpRequest",
        "X-Upwork-Accept-Language": "en-US",
    };
    const jobData = await evaluate(page, url, headers);
    if (
        jobData.opening.job.budget.amount > 0 &&
        jobData.opening.job.budget.amount < process.env.MIN_BUDGET
    ) {
        return "=== go away ===";
    }
    for (const country of DISABLE_COUNTRY) {
        if (
            jobData.organization.contact.country
                .toLowerCase()
                .indexOf(country.toLowerCase()) > -1
        ) {
            return "=== go away ===";
        }
    }
    if (jobData.opening.title.indexOf("Expensify") > -1) {
        return "=== go away ===";
    }
    return jobId;
};
(async () => {
    try {
        const { id: accountId, email } = await getAvailableEmail();
        if (!email) {
            process.exit(1);
        }
        let userDataDirectory = path.join(
            os.tmpdir(),
            `puppeteer_${Date.now() + Math.random().toString(36).substr(2, 6)}`
        );
        const browserOptions = {
            defaultViewport: null,
            userDataDir: userDataDirectory,
            args: ["--start-maximized"],
        };
        const headlessConfiguration = process.env.HEADLESS;
        browserOptions.headless = headlessConfiguration === "false" ? false : true;
        console.log(`Log => HEADLESS: ${browserOptions.headless}`);
        if (process.platform === "linux") { browserOptions.args.push("--no-sandbox"); }
        const browser = await puppeteerExtra.launch(browserOptions);                                                // Login to the Upwork account
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(25000);
        await page.goto("https://www.upwork.com/ab/account-security/login?redir=%2Fnx%2Ffind-work%2Fmost-recent");
        await input(page, "#login_username", email);
        await click({component: page, selector: "#login_password_continue"});
        await wait(1000);
        await input(page, "#login_password", process.env.PASSWORD);
        await Promise.all([
            page.waitForNavigation({ timeout: 30000 }),
            click({component: page,selector: "#login_control_continue",})
        ]);
        AUTH = await getAuthData(page);
        let previousJobId = "";
        console.log(`================== ${email} ===================`);                                             // continuous process to get new jobs and apply
        while (true) {
            let { title, description, jobId } = await getNewJob(page);
            jobId = await filterJob(page, jobId);
            console.log("[TITLE] ", title);
            console.log(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
            if (jobId !== "=== go away ===") {
                const isJobExists = await findJob(jobId);
                if (!isJobExists && jobId !== previousJobId) {
                    await page.goto(
                        `https://www.upwork.com/ab/proposals/job/${jobId}/apply/`
                    );
                    AUTH = await getAuthData(page);
                    const jobDetails = await getJobDetail(page, jobId);
                    const applyResponse = await apply(page, jobDetails);
                    console.log(applyResponse);
                    if (typeof applyResponse !== "number") {
                        await saveJob(email, {
                            title,
                            description,
                            link: jobId,
                            connect: 0,
                        });
                        console.log("======= Applied job is saved successfully =======");
                        await updateStatus(accountId, "sent");
                        console.log("======= Account status was updated =======");
                        break;
                    } else {
                        await removeAccount(accountId);
                        await saveJob(email, {
                            title,
                            description,
                            link: jobId,
                            connect: 1000,
                        });
                        break;
                    }
                }
            }
            await wait(2000);
        }
        await browser.close();
        process.exit(0);
    } catch (error) {
        console.log("An error occurred:", error);
        process.exit(1);
    }
})();
