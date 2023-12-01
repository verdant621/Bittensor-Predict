import dotenv from "dotenv";
import os from "os";
import path from "path";
import puppeteerExtra from "puppeteer-extra";
import { click } from "puppeteer-utilz";
import puppeteerExtraPluginStealth from "puppeteer-extra-plugin-stealth";
import { getRemainedEmail, saveAccount } from "./firebase/firebase.js";
import {
  generateAddress,
  generateEmail,
  getEmailVeryfyLink,
  getVerifyLink,
} from "./mailbox.js";
import { readFileAsync, wait, evaluate } from "./utils.js";

export const GQL_URL = "https://www.upwork.com/api/graphql/v1";

export const ORDER = [
  "CREATE-PROFILE/EXPERIENCE",
  "CREATE-PROFILE/GOAL",
  "CREATE-PROFILE/WORK-PREFERENCE-1",
  "CREATE-PROFILE/WORK-PREFERENCE-2",
  "CREATE-PROFILE/TITLE",
  "CREATE-PROFILE/EMPLOYMENT",
  "CREATE-PROFILE/EDUCATION",
  "CREATE-PROFILE/LANGUAGES",
  "CREATE-PROFILE/SKILLS",
  "CREATE-PROFILE/OVERVIEW",
  "CREATE-PROFILE/CATEGORIES",
  "CREATE-PROFILE/RATE",
  "CREATE-PROFILE/BIRTHDAY",
  "CREATE-PROFILE/ADDR&PHONE",
  "COMPLETE-ONBOARDING",
  "REVIEW",
  "NOTIFICATION",
];

export function generateGQLHeader(token) {
  return {
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    Authorization: `bearer ${token}`,
    "Content-Type": "application/json",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    "X-Upwork-Accept-Language": "en-US",
  };
}

export function generateAPIHeader(token, csrfToken) {
  return {
    Accept: "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    Authorization: `bearer ${token}`,
    "Content-Type": "application/json",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    "x-odesk-csrf-token": csrfToken,
    "x-odesk-user-agent": "oDesk LM",
    "x-requested-with": "XMLHttpRequest",
    "X-Upwork-Accept-Language": "en-US",
  };
}

export function generateBody(action, data) {
  if (action === "CREATE-PROFILE/EXPERIENCE")
    return {
      query: `
          mutation updateTalentQuestionChoices($input: UpdateTalentQuestionChoicesInput) {
            updateTalentQuestionChoices(input: $input) {
              status
            }
          }
        `,
      variables: {
        input: {
          questionId: "EXPERIENCE",
          choiceIds: ["FREELANCED_BEFORE"],
        },
      },
    };
  else if (action === "CREATE-PROFILE/GOAL")
    return {
      query: `
                mutation updateTalentQuestionChoices($input: UpdateTalentQuestionChoicesInput) {
                updateTalentQuestionChoices(input: $input) {
                    status
                }
                }
            `,
      variables: {
        input: {
          questionId: "FREELANCE_GOAL",
          choiceIds: ["GET_EXPERIENCE"],
        },
      },
    };
  else if (action === "CREATE-PROFILE/WORK-PREFERENCE")
    return {
      query: `
                mutation updateFreelancerContractToHire($input: FreelancerContractToHireInput) {
                    updateFreelancerContractToHire(input: $input) {
                    status
                    }
                }
                `,
      variables: {
        input: {
          contractToHire: true,
        },
      },
    };
  else if (action === "CREATE-PROFILE/TITLE")
    return {
      query: `
                mutation updateTalentProfileTitle($input: TalentProfileTitleInput!) {
                    updateTalentProfileTitle(input: $input) {
                    status
                    }
                }
                `,
      variables: {
        input: {
          title: `${data.title}`,
        },
      },
    };
  else if (action === "CREATE-PROFILE/EMPLOYMENT")
    return {
      query: `
                mutation updateTalentEmploymentRecords($records: [TalentEmploymentRecordInput!]) {
                    updateTalentEmploymentRecords(records: $records) {
                    id
                    }
                }
                `,
      variables: {
        records: data.employment.map((emp) => ({
          companyName: emp.company,
          jobTitle: emp.role,
          description: null,
          city: null,
          country: "HKG",
          startDate: emp.start,
          endDate: emp.end,
        })),
      },
    };
  else if (action === "CREATE-PROFILE/EDUCATION")
    return {
      query: `
                mutation updateTalentEducationRecords($records: [TalentEducationRecordInput!]) {
                  updateTalentEducationRecords(records: $records) {
                    id
                  }
                }
              `,
      variables: {
        records: data.education.map((edu) => ({
          institutionName: edu.university,
          areaOfStudy: edu.field,
          degree: edu.degree,
          dateStarted: edu.start,
          dateEnded: edu.end,
        })),
      },
    };
  else if (action === "CREATE-PROFILE/LANGUAGES")
    return {
      query: `
                mutation updateTalentLanguageRecords($records: [TalentLanguageInput!]) {
                updateTalentLanguageRecords(records: $records) {
                    id
                }
                }
            `,
      variables: {
        records: [
          {
            language: {
              iso639Code: "en",
              active: true,
              englishName: "English",
            },
            proficiencyLevel: { code: "flul" },
          },
        ],
      },
    };
  else if (action === "CREATE-PROFILE/SKILLS")
    return {
      query: `
                mutation updateTalentProfileSkills($input: TalentProfileSkillsInput!) {
                updateTalentProfileSkills(input: $input) {
                    status
                }
                }
            `,
      variables: {
        input: { skills: data.skills },
      },
    };
  else if (action === "CREATE-PROFILE/OVERVIEW")
    return {
      query: `
                mutation updateTalentProfileDescription($input: TalentProfileDescriptionInput!) {
                  updateTalentProfileDescription(input: $input) {
                    status
                  }
                }
              `,
      variables: {
        input: { description: data.overview },
      },
    };
  else if (action === "CREATE-PROFILE/CATEGORIES")
    return {
      query: `
                mutation updateTalentProfileSubCategories($input: TalentProfileSubCategoriesInput!) {
                updateTalentProfileSubCategories(input: $input) {
                    status
                }
                }
            `,
      variables: {
        input: { subCategoryIDs: data.categories },
      },
    };
  else if (action === "CREATE-PROFILE/RATE")
    return {
      query: `
                mutation updateTalentProfileHourlyRate($input: TalentProfileHourlyRateInput!) {
                  updateTalentProfileHourlyRate(input: $input) {
                    status
                  }
                }
              `,
      variables: {
        input: {
          hourlyRate: {
            amount: data.rate,
            currency: "USD",
          },
        },
      },
    };
  else if (action == "CREATE-PROFILE/BIRTHDAY")
    return {
      query: `
            mutation saveDateOfBirth($input: DateOfBirthInput!) {
                saveDateOfBirth(input: $input)
            }
            `,
      variables: {
        input: { dateOfBirth: data.birthday },
      },
    };
  else if (action === "CREATE_PROFILE_ADDRESS_PHONE")
    return {
      address: {
        street: data.street,
        state: data.state,
        city: data.city,
        zip: data.zip,
        additionalInfo: "",
        country: data.country,
        address: null,
      },
      phoneNumber: data.phone,
      phoneCode: data.phoneCode,
    };
  else if (action === "COMPLETE_ONBOARDING")
    return {
      query: `
                mutation {
                  talentOnboardingComplete
                }
              `,
      variables: null,
    };
  else if (action === "REVIEW") return {};
  else if (action === "NOTIFICATION")
    return {
      desktopCounter: "all",
      desktopNotify: "all",
      desktopSound: "false",
      mobileNotify: "all",
      mobileCounter: "all",
      mobileSound: "false",
      dashEmailFreq: "immediate",
      dashEmailWhen: "always",
      dashEmailPresence: "mine",
      allContracts: true,
      allRecruiting: true,
      receive_documents_digitally: false,
      dash_desktop_all: true,
      dash_desktop_important: true,
      dash_desktop_never: true,
      dash_desktop_sound: true,
      dash_message_counter_all: true,
      dash_message_counter_important: true,
      dash_email_approximately: true,
      dash_email_all: true,
      dash_email_important: true,
      dash_email_presence: true,
      er_job_posted: true,
      er_japp_submitted: true,
      er_intv_acc: true,
      er_intv_declined: true,
      er_offer_updated: true,
      er_job_will_expire: true,
      er_job_expired: true,
      er_no_intv: true,
      pja_intv_accepted: true,
      pja_offer: true,
      pja_japp_declined: true,
      pja_japp_rejected: true,
      pja_job_change: true,
      pja_japp_withdrawn: true,
      cntr_hire: true,
      cntr_timelog_begins: true,
      cntr_terms: true,
      cntr_end: true,
      cntr_timelog: true,
      cntr_fb_change: true,
      cntr_offline_summary: true,
      cntr_bpa_wk_buyer: true,
      cntr_misc: true,
      cntr_bpa: true,
      grp_mem: true,
      ref_profile: true,
      ref_invite: true,
      cntr_revoke: true,
      subscription_event: true,
      on_board_msg: true,
      misc_local: true,
      who_viewed_job: true,
      connects_expiry: true,
      connects_purchase: true,
      job_recommendations: true,
      marketing_email: false,
      tc: [],
    };
  else if (action === "GET_SKILL_ID")
    return {
      query: `
                query ontologyElementsSearchByPrefLabel($filter: OntologyElementsSearchByPrefLabelFilter) {
                  ontologyElementsSearchByPrefLabel(filter: $filter) {
                    id
                    ontologyId
                    preferredLabel
                    ... on Skill {
                      legacySkillNid
                    }
                  }
                }
              `,
      variables: {
        filter: {
          preferredLabel_any: data.skill,
          type: "SKILL",
          entityStatus_eq: "ACTIVE",
          sortOrder: "match-start",
          limit: 50,
          includeAttributeGroups: false,
        },
      },
    };
  else if (action === "GET_SERVICE_ID")
    return {
      query: `
                query {
                  ontologyCategories {
                    id
                    preferredLabel
                    subcategories {
                      id
                      preferredLabel
                    }
                  }
                }
              `,
      variables: null,
    };
  else if (action === "GET_LOCATION_DATA")
    return {
      query: `
                query getCity($countryCode: String!, $query: String!) {
                citySearchRecords(filter: { country_eq: $countryCode, query_eq: $query }, limit: 5) {
                city {
                    name,
                    state {
                    code,
                    name,
                    country {
                        twoLetterAbbreviation
                    }
                    }
                },
                }
            }
            `,
      variables: {
        countryCode: data.countryCode,
        query: data.city,
      },
    };
  else if (action === "BID")
    return {
      version: 3,
      jobReference: data.jobReference,
      agency: null,
      chargedAmount: 50,
      coverLetter: data.bidMessage,
      earnedAmount: null,
      estimatedDuration: null,
      occupationUID: null,
      portfolioItemUids: [],
      attachments: [],
      questions: [],
      milestones: [],
      readyToStartDate: null,
      selectedContractor: {
        uid: data.uid,
        oDeskUserID: data.oDeskUserID,
      },
      profileRateToSet: false,
      boostBidAmount: 50,
      rateGuidance: null,
      agencyOrgUid: null,
    };
}

const stealth = puppeteerExtraPluginStealth();
puppeteerExtra.use(stealth);
stealth.enabledEvasions.delete("iframe.contentWindow");
dotenv.config();
let AUTH = { token: "", oauth: "" };

function generatePhoneNumber() {
  const baseNum = Math.floor(Math.random() * 87701858) + 15629744;
  return baseNum.toString();
}

async function getAuthData(browser) {
  const data = {
    token: "",
    oauth: "",
  };
  const scoreboard = [];
  const cookies = await browser.cookies();
  for (const cookie of cookies) {
    if (cookie.name === "XSRF-TOKEN") data.token = cookie.value;
    if (cookie.name.endsWith("sb") && cookie.value.startsWith("oauth2v2_")) {
      scoreboard.push(cookie.value);
    }
  }

  for (const scoreboardValue of scoreboard) {
    const url = "https://www.upwork.com/api/graphql/v1";
    const headers = {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      Authorization: `bearer ${scoreboardValue}`,
      "Content-Type": "application/json",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": {
        // Add your User-Agent here
      },
      "X-Upwork-Accept-Language": "en-US",
    };
    const body = {
      query: `query ontologyElementsSearchByPrefLabel($filter: OntologyElementsSearchByPrefLabelFilter) {
        ontologyElementsSearchByPrefLabel(filter: $filter) {
          id
          ontologyId
          preferredLabel
          ... on Skill {
            legacySkillNid
          }
        }
      }`,
      variables: {
        filter: {
          preferredLabel_any: "Angularjs",
          type: "SKILL",
          entityStatus_eq: "ACTIVE",
          sortOrder: "match-start",
          limit: 50,
          includeAttributeGroups: true,
        },
      },
    };
    const response = await evaluate(browser, url, headers, body);
    if (response.data) {
      data.oauth = scoreboardValue;
      break;
    }
  }
  return data;
}

export const input = async (page, selector, key, time = 0) => {
  await page.waitForSelector(selector);
  return await page.type(selector, key, { delay: time });
};

async function getSkillIds(client, skills) {
  const headers = generateGQLHeader(AUTH.oauth);
  let skillIDs = [];
  for (const skill of skills) {
    const body = generateBody("GET_SKILL_ID", { skill });
    const response = await evaluate(client, GQL_URL, headers, body);
    if (response.data) {
      skillIDs.push({
        skillID: response.data.ontologyElementsSearchByPrefLabel[0].id,
      });
    }
  }
  return skillIDs;
}

async function getServiceIds(client, services) {
  const headers = generateGQLHeader(AUTH.oauth);
  let serviceIds = [];
  const body = generateBody("GET_SERVICE_ID");
  const response = await evaluate(client, GQL_URL, headers, body);
  if (response.data) {
    let categories = [];
    response.data.ontologyCategories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        categories.push(subcategory);
      });
    });
    for (const service of services) {
      for (const category of categories) {
        if (category.preferredLabel === service) {
          serviceIds.push(category.id);
          continue;
        }
      }
    }
  }
  return serviceIds;
}

async function getLocation(client, city, countryCode) {
  const headers = generateGQLHeader(AUTH.oauth);
  const body = generateBody("GET_LOCATION_DATA", {
    city,
    countryCode,
  });
  const response = await evaluate(client, GQL_URL, headers, body);
  if (response.data) {
    return {
      city: response.data.citySearchRecords[0].city.name,
      state: response.data.citySearchRecords[0].city.state.code,
    };
  }
}

async function generateProfile(client, profileData) {
  const profileActions = { first: [], last: [] };
  profileActions.first.push({ type: "CREATE-PROFILE/EXPERIENCE", data: null });
  profileActions.first.push({ type: "CREATE-PROFILE/GOAL", data: null });
  profileActions.first.push({
    type: "CREATE-PROFILE/WORK-PREFERENCE-1",
    data: null,
  });
  profileActions.first.push({
    type: "CREATE-PROFILE/WORK-PREFERENCE-2",
    data: null,
  });
  profileActions.first.push({
    type: "START_PROFILE_PROCESS",
    method: "api",
    url: "https://www.upwork.com/ab/create-profile/api/min/v1/start-profile-process",
    data: null,
  });

  // Entry data actions
  profileActions.first.push({
    type: "CREATE-PROFILE/TITLE",
    data: { title: profileData.professional },
  });
  profileActions.first.push({
    type: "CREATE-PROFILE/EMPLOYMENT",
    data: { employment: profileData.workXP },
  });
  profileActions.first.push({
    type: "CREATE-PROFILE/EDUCATION",
    data: { education: profileData.education },
  });
  profileActions.first.push({ type: "CREATE-PROFILE/LANGUAGES", data: null });
  profileActions.first.push({
    type: "CREATE-PROFILE/SKILLS",
    data: {
      skills: await getSkillIds(client, profileData.skills),
    },
  });

  profileActions.first.push({
    type: "CREATE-PROFILE/OVERVIEW",
    data: { overview: profileData.overview },
  });
  profileActions.first.push({
    type: "CREATE-PROFILE/CATEGORIES",
    data: {
      categories: await getServiceIds(client, profileData.services),
    },
  });
  profileActions.first.push({
    type: "CREATE-PROFILE/RATE",
    data: { rate: profileData.hourRate },
  });
  profileActions.first.push({
    type: "CREATE-PROFILE/BIRTHDAY",
    data: { birthday: profileData.birthday },
  });

  const { city, state } = await getLocation(
    client,
    profileData.city,
    profileData.countryCode
  );

  profileActions.first.push({
    type: "CREATE-PROFILE/ADDR&PHONE",
    data: {
      street: profileData.street,
      state,
      city,
      zip: profileData.zipcode,
      country: profileData.country,
      phone: generatePhoneNumber(),
      phoneCode: profileData.countryCode,
    },
    method: "api",
    url: "https://www.upwork.com/ab/create-profile/api/min/v1/save-address-phone",
  });

  // Completion actions
  profileActions.last = [
    { type: "COMPLETE_ONBOARDING", data: null },
    {
      type: "REVIEW",
      method: "api",
      url: "https://www.upwork.com/ab/create-profile/api/v1/review",
      data: null,
    },
    {
      type: "NOTIFICATION",
      method: "api",
      url: "https://www.upwork.com/ab/notification-settings/api/settings",
      data: null,
    },
  ];
  return profileActions;
}

async function handleRequest(browserInstance, requestList) {
    for (const requestObject of requestList) {
      if (requestObject["method"] === "api") {
        const apiHeader = generateAPIHeader(AUTH["oauth"], AUTH["token"]);
        const apiBody = generateBody(requestObject["type"], requestObject["data"]);
        await evaluate(browserInstance, requestObject["url"], apiHeader, apiBody);
      } else {
        const gqlHeader = generateGQLHeader(AUTH["oauth"]);
        const gqlBody = generateBody(requestObject["type"], requestObject["data"]);
        await evaluate(browserInstance, GQL_URL, gqlHeader, gqlBody);
      }
      console.log("[PASS]", requestObject["type"]);
    }
  }

async function Login(userData) {
  let email, accessToken;
  if (process.env.TEMP_EMAIL === "generator.email")
    email = await generateEmail(`${userData.first_name}${userData.last_name}`);
  if (process.env.TEMP_EMAIL === "minuteinbox") {
    const generatedAddress = await generateAddress();
    email = generatedAddress.email;
    accessToken = generatedAddress.accessToken;
  }
  console.log(`=========== ${email} ==========`);
  let tmpDir = path.join(
    os.tmpdir(),
    `puppeteer_${Date.now()}${Math.random().toString().substring(2, 6)}`
  );
  let puppeteerArgs = {
    defaultViewport: null,
    userDataDir: tmpDir,
    args: ["--start-maximized"],
  };

  const headless = process.env.HEADLESS;
  puppeteerArgs.headless = headless === "false" ? false : true;
  if (process.platform === "linux") {
    puppeteerArgs.args.push("--no-sandbox");
  }
  const browser = await puppeteerExtra.launch(puppeteerArgs);
  const page = await browser.newPage();
  let avatarUploaded = false;
  try {
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      request.continue();
    });
    const portraitUploadUrl =
      "https://www.upwork.com/ab/create-profile/api/v2/portrait-upload";
    page.on("requestfinished", (requestObj) => {
      if (requestObj.url() === portraitUploadUrl) {
        avatarUploaded = true;
        console.log("[INFO] Avatar is uploaded successfully");
      }
    });
    await page.setCacheEnabled(false);
    await page.goto("https://www.upwork.com/nx/signup", {
      waitUntil: "networkidle0",
    });
    await page.goto("https://www.upwork.com/nx/signup/?dest=home", {
      timeout: 60000,
    });
    await click({ component: page, selector: 'input[name="radio-group-2"]' });
    await click({ component: page, selector: 'button[data-qa="btn-apply"]' });
    await input(page, "#first-name-input", userData.first_name);
    await input(page, "#last-name-input", userData.last_name);
    await input(page, "#redesigned-input-email", email);
    await input(page, "#password-input", process.env.PASSWORD);
    await click({ component: page, selector: "input#checkbox-terms" });
    await click({ component: page, selector: "input#checkbox-promo" });
    await page.click("#button-submit-form");
    await page.waitForNavigation();
    console.log("[Info] Verifying ...");
    let verifyEmailLink,
      lrequestCount = 0,
      maxRequestCount = 5;
    while (!verifyEmailLink && lrequestCount <= maxRequestCount) {
      if (process.env.TEMP_EMAIL === "generator.email") {
        verifyEmailLink = await getEmailVeryfyLink(email);
      } else if (process.env.TEMP_EMAIL === "minuteinbox") {
        verifyEmailLink = await getVerifyLink(email, accessToken);
      }
      if (verifyEmailLink) break;
      console.log("Verify link not found");
      await wait(6000);
      lrequestCount++;
    }
    if (!verifyEmailLink) throw new Error("Verification link not found");
    await page.goto(verifyEmailLink, { waitUntil: "networkidle0" });
    await page.goto("https://www.upwork.com/nx/create-profile/", {
      waitUntil: "networkidle0",
    });
    AUTH = await getAuthData(page);
    const profileData = await generateProfile(page, userData);
    await handleRequest(page, profileData.first);
    await page.goto("https://www.upwork.com/nx/create-profile/location");
    console.log(1);
    await click({ component: page, selector: "button[data-qa=open-loader]" });
    const profileImagePath = path.join(
      process.cwd(),
      "profiles",
      userData.avatar
    );
    await page.waitForSelector('input[type="file"]');
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('input[type="file"]'),
    ]);
    await fileChooser.accept([profileImagePath]);
    await wait(3000);
    await handleRequest(page, userData.last);
    console.log("========== Account has been created successfully ========");
  } catch (error) {
    console.log("error: ", error);
    await browser.close();
  }
  return true;
}

async function main() {
  try {
    const filePath = path.join(
      process.cwd(),
      "profiles",
      `${process.argv[2]}.json`
    );
    let userData = await readFileAsync(filePath, "utf8");
    userData = JSON.parse(userData);
    let result = await Login(userData);
    console.log(`Log => result: ${result}`);
    return true;
  } catch (error) {
    console.log(`Log => error: ${error}`);
    return false;
  }
}

(async () => {
  const options = {
    locale: "en-US",
    timezone: "Asia/Tokyo",
    defaultAccount: eval(process.env["DEFAULT_ACCOUNT"]),
    remainedEmail: await getRemainedEmail(),
    iterationCount: eval(process.argv[3]),
  };

  try {
    if (process.argv[3] === "inf") {
      while (true) {
        console.log(
          new Date().toLocaleString(options.locale, {
            timeZone: options.timezone,
          })
        );
        if (options.remainedEmail < options.defaultAccount) {
          await main();
        } else {
          await wait(1000);
        }
      }
    } else {
      for (let i = 0; i < options.iterationCount; i++) {
        console.log("=========== " + (i + 1) + " ===========");
        console.log(
          new Date().toLocaleString(options.locale, {
            timeZone: options.timezone,
          })
        );
        await main();
      }
    }
  } catch (error) {
    console.log(error);
  }
  process.exit();
})();
