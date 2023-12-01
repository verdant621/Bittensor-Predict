import axios from 'axios';
import randomstring from 'randomstring';
import cheerio from "cheerio";
import crypto from "crypto";

const BASE_URL = 'https://www.minuteinbox.com/';

export async function generateAddress() {
    const accessToken = randomstring.generate({
        length: 20,
        charset: 'abcdefghijklmnopqrstuvwxyz'.substring(0, 21)
    });

    const headers = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Connection': 'close',
        'Cookie': `PHPSESSID=${accessToken}`
    };

    const options = {
        method: 'GET',
        headers: headers
    };

    try {
        const response = await fetch(BASE_URL + '/index', options);
        const responseText = await response.text();
        const responseCleanedText = responseText.replace(/^\uFEFF/, ''); // Remove the BOM (Byte Order Mark)
        const responseJson = JSON.parse(responseCleanedText);
        const email = responseJson.email;

        await forceExtendInbox(568523, email, accessToken);

        return { email, accessToken };
    } catch (error) {
        throw new Error(error);
    }
}

async function forceExtendInbox(time, email, accessToken) {
    try {
        const headers = {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'close',
            'Cookie': `PHPSESSID=${accessToken}; MI=${email}`
        };

        await fetch(BASE_URL + '/expirace/' + time, { headers });
    } catch (error) {
        throw new Error('The mail inbox is invalid or expired.');
    }
}

async function fetchMails(email, accessToken) {
    try {
        const headers = {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'close',
            'Cookie': `PHPSESSID=${accessToken}; MI=${email}`
        };

        const response = await fetch(BASE_URL + '/index/refresh', { headers });
        const responseJson = await response.json();

        const mailList = responseJson.map(mail => ({
            id: mail.id,
            subject: mail.predmet,
            sender: mail.od,
            time: mail.kdy,
            content: mail.akce
        }));

        return mailList;
    } catch (error) {
        throw new Error('The mail inbox is invalid or expired.');
    }
}

export async function getVerifyLink(email, accessToken) {
    try {
        const headers = {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'close',
            'Cookie': `PHPSESSID=${accessToken}; MI=${email}`
        };

        const resp = await fetch(BASE_URL + `/email/id/2`, { headers });
        const content = await resp.text();

        const $ = cheerio.load(content);
        const links = [];

        $('a').each((index, element) => {
            const link = $(element).attr('href');
            links.push(link);
        });

        if (links.length >= 2) return links[1];
        else return null;

    } catch (error) {
        throw new Error('The mail inbox is invalid or expired.');
    }
}

let domains = [
    "activehealthsystems.com",
    "apexhearthealth.com",
    // "lowcountryrainharvesting.com",
    "woaddd.shop",
    "moonstarxl.com",
    "psicoanet.com",
    "corpmail.mooo.com",
    // "kutaks.sytes.net",
    "gmail.com.jmortgageli.com",
    "gmail.com.innoberg.com",
    "bookofexperts.com",
    // "shopmajik.com"
];

function generateText(feed) {
    const prefix = feed;
    let maxLength = 25 - prefix.length;

    // Generate random suffix
    let suffix = crypto
        .randomBytes(maxLength)
        .toString("hex")
        .substring(0, maxLength);

    // Combine prefix and suffix
    let text = prefix + suffix;

    return text.toLowerCase();
}

let FAKEMAIL_URL = "https://generator.email/inbox/";

export async function generateEmail(name) {// 
    let email = generateText(name.toLowerCase()) + '@' + domains[Math.floor(Math.random() * domains.length)];

    try {
        await getInbox(email);
    } catch (error) {
        console.log(error)
    }

    return email;
}

async function getInbox(email) {
    const emailParts = email.split("@");
    const prefix = emailParts[0];
    const suffix = emailParts[1];

    const headers = {
        "authority": "generator.email",
        "method": "GET",
        "path": "/inbox9/",
        "scheme": "https",
        "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        "Cookie": `_ga=GA1.1.1792958436.1694916301; soundnotification=on; slds=on; embx=%5B%22${prefix}%40${suffix}%22%2C%22ronbombbomb%40${suffix}%22%2C%22ronbombb.omb%40${suffix}%22%2C%22ronbombdsffdsbomb%40${suffix}%22%2C%22bhert123%40discretevtd.com%22%5D; _ga_1GPPTBHNKN=GS1.1.1695097465.5.1.1695097877.48.0.0; surl=${suffix}/${prefix}`,
        "Sec-Ch-Ua":
            '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    };

    let response;
    try {
        response = await axios.get(FAKEMAIL_URL, { headers });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Error:", response.statusText);
            return "";
        }
    } catch (error) {
        return "";
        console.error("Error:", error.message);
    }
}

export async function getEmailVeryfyLink(email) {
    let htmlContent;

    try {
        htmlContent = await getInbox(email);
    } catch (error) {
        console.error("Failed to fetch inbox:", error);
        return false;
    }

    const $ = cheerio.load(htmlContent);

    const verifyEmailLink = $("a:contains('Verify')");

    const elements = $("#email-table .list-group-item div.time_div_45g45gg");

    elements.each((i, element) => {
        const lastCheckedAt = $(element).text();
        console.log(lastCheckedAt);
    });

    const msg = await getMessages(email);
    if (verifyEmailLink.length > 0) {
        const href = verifyEmailLink.attr("href");
        return href;
    }


    return false;
}

export async function getMessages(email) {
    const messages = [];
    try {
        const body = await getInbox(email);
        const $ = cheerio.load(body);
        const mails = $("#email-table .list-group-item");

        for (const mail of mails) {
            const fromEmail = $(mail).find("div.from_div_45g45gg").text();

            if (fromEmail === "") continue;

            const subject = $(mail).find("div.subj_div_45g45gg").text();
            const timestamp = $(mail).find("div.time_div_45g45gg").text();
            const link = $(mail).attr("href");
            // if (
            //     subject.includes("You have unread messages about the job") ||
            //     subject.includes("Offer:") ||
            //     subject.includes("Invitation") ||
            //     subject.includes("You received a direct")
            // )
            messages.push(subject);
        }
        return messages;
    } catch (e) {
        console.log(e)
        return [];
    }
}