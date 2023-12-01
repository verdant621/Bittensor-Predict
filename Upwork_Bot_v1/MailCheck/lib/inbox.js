import axios from "axios";
import cheerio from "cheerio";
import { generateText, getHash, getRandomElement } from "./utils.js";


const domains = [
  "activehealthsystems.com",
  "apexhearthealth.com",
  "lowcountryrainharvesting.com",
  "woaddd.shop",
  "moonstarxl.com",
  "psicoanet.com",
  "corpmail.mooo.com",
  "kutaks.sytes.net",
  "gmail.com.jmortgageli.com",
  "gmail.com.innoberg.com"
];
export class GeneratorMail {
  constructor(email) {
    this.email = email;
  }
  static generateRandomEmail(name) {
    return generateText(name) + "@" + getRandomElement(domains);
  }
  async getInbox() {
    const url = "https://generator.email/inbox/";
    const emailParts = this.email.split("@");
    const prefix = emailParts[0];
    const suffix = emailParts[1];
    const headers = {
      authority: "generator.email",
      method: "GET",
      path: "/inbox9/",
      scheme: "https",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "max-age=0",
      Cookie: `_ga=GA1.1.1792958436.1694916301; soundnotification=on; slds=on; embx=%5B%22${prefix}%40${suffix}%22%2C%22ronbombbomb%40${suffix}%22%2C%22ronbombb.omb%40${suffix}%22%2C%22ronbombdsffdsbomb%40${suffix}%22%2C%22bhert123%40discretevtd.com%22%5D; _ga_1GPPTBHNKN=GS1.1.1695097465.5.1.1695097877.48.0.0; surl=${suffix}/${prefix}`,
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
      response = await axios.get(url, { headers });

      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  async verify() {
    let href;
    let temp = 0;
    while (true) {
      let htmlContent;
      try {
        htmlContent = await this.getInbox();
      } catch (error) {
        console.error("Failed to fetch inbox:", error);
        continue;
      }

      const $ = cheerio.load(htmlContent);

      const verifyEmailLink = $("a:contains('Verify')");

      const elements = $("#email-table .list-group-item div.time_div_45g45gg");

      elements.each((i, element) => {
        const lastCheckedAt = $(element).text();
        console.log(lastCheckedAt);
      });

      if (verifyEmailLink.length > 0) {
        href = verifyEmailLink.attr("href");
        return href;
      } else {
        temp += 1;
        if (temp >= 10) {
          console.log('Limit')
          throw new Error('Verfication Limit reached.')
        }
        console.log("Verify Email link not found");
      }
    }
  }

  async getMessages() {
    const messages = [];
    try {
      const body = await this.getInbox();
      const $ = cheerio.load(body);
      const mails = $("#email-table .list-group-item"); // finding that has issues
      for (const mail of mails) {
        const fromEmail = $(mail).find("div.from_div_45g45gg").text();
        // console.log(fromEmail);
        if (fromEmail === "") continue;
        const subject = $(mail).find("div.subj_div_45g45gg").text();
        // console.log(subject);
        const timestamp = $(mail).find("div.time_div_45g45gg").text();
        // console.log(timestamp);
        const link = $(mail).attr('href')
        

        const id = getHash(this.email + ':' + subject + ':' + timestamp)
        if (subject.includes('You have unread messages about the job') || subject.includes('Offer:') || subject.includes('You received a direct message from a client') || subject.includes('Invitation to Interview for'))
          messages.push({
            id,
            fromEmail,
            subject,
            timestamp,
            link,
          });
      }

    } catch (e) {
      console.error('[ERR] ', e)
    }

    return messages;
  }
}