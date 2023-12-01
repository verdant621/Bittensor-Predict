import axios from "axios";
import cheerio from "cheerio";
import { generateText, getHash, getRandomElement } from "./utils.js";

let baseUrl = "https://generator.email";
let domains = [
  "activehealthsystems.com",
  "apexhearthealth.com",
  "lowcountryrainharvesting.com",
  "woaddd.shop",
  "moonstarxl.com",
  "psicoanet.com",
  "corpmail.mooo.com",
  "kutaks.sytes.net",
  "gmail.com.jmortgageli.com",
  "gmail.com.innoberg.com",
  "bookofexperts.com",
  "shopmajik.com"
];

export class GeneratorMail {
  constructor(email) {
    this.email = email;
  }
  static create(name) {
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
        if (fromEmail === "") continue;
        const subject = $(mail).find("div.subj_div_45g45gg").text();
        const timestamp = $(mail).find("div.time_div_45g45gg").text();
        const link = $(mail).attr("href");

        const id = getHash(this.email + ":" + subject + ":" + timestamp);
        if (
          subject.includes("You have unread messages about the job") ||
          subject.includes("Offer:") ||
          subject.includes("Invitation") ||
          subject.includes("You received a direct")
        )
          messages.push({
            id,
            fromEmail,
            subject,
            timestamp,
            link: baseUrl + link,
          });
      }
      return messages;
    } catch (e) {
      console.error("[ERR] Timeout");
      return [];
    }
  }
}

function parseHtml(input) {
  const $ = cheerio.load(input);
  return $("body").html();
}

export class FakeMail {
  constructor(email) {
    this.email = email;
    this.headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US;q=0.7,en;q=0.3",
      "X-Requested-With": "XMLHttpRequest",
      Connection: "keep-alive",
      Referer: "https://www.fakemail.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
    };
  }
  static async create() {
    const headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US;q=0.7,en;q=0.3",
      "X-Requested-With": "XMLHttpRequest",
      Connection: "keep-alive",
      Referer: "https://www.fakemail.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
    };
    const {
      data: { email },
    } = await axios.get("https://www.fakemail.net/index/index", { headers });
    const url = "https://www.fakemail.net/expirace/1209600";
    const cookie = `TMA=${email};`;
    await axios.get(url, { headers: { ...headers, Cookie: cookie } });

    return email;
  }
  async getMonth() {
    const cookie = `TMA=${this.email};`;
    const response = await axios.get("https://www.fakemail.net/index/zivot", {
      headers: { ...this.headers, Cookie: cookie },
    });
    console.log(response.data);
  }
  async getInbox() {
    const cookie = `TMA=${this.email};`;
    const { data } = await axios.get("https://www.fakemail.net/index/refresh", {
      headers: { ...this.headers, Cookie: cookie },
    });
    return (data || []).map((message) => {
      const id = this.email + ":" + message['id'];
      return {
        id: id,
        email: this.email,
        subject: message["predmet"],
        from: message["od"],
        timestamp: message["kdy"],
        link: message['id'],
      };
    });
  }
  async getMessages() {
    try {
      const data = await this.getInbox();
      const messages = await Promise.all(
        data.map(async (message) => {
          const id = message["id"];
          const data = this.getMessageContent(id);
          return {
            ...message,
            body: parseHtml(data),
          };
        })
      );
      return messages;
    } catch (error) {
      console.log("[ERR]");
    }
  }
  async verify() {
    let inboxes;
    let retry = 0;
    while (retry < 20) {
      const data = await this.getInbox();
      inboxes = data.filter((el) => {
        if (el["subject"].includes("Verify")) {
          return true;
        }
        return false;
      });
      if (inboxes.length > 0) break;
      retry++;
      console.log("[INFO] Retry..." + retry);
    }
    if (retry === 20) throw new Error("Maximum Retry Exceed");

    const last = inboxes[0];
    const message = await this.getMessageContent(last["id"]);
    const $ = cheerio.load(message);
    return $('a:contains("Verify Email")').attr("href");
  }
  async getMessageContent(id) {
    const cookie = `TMA=${this.email};`;
    const response = await axios.get(
      `https://www.fakemail.net/email/id/${id}`,
      { headers: { ...this.headers, Cookie: cookie } }
    );
    return response.data;
  }
}

export class MMail {
  constructor(email) {
    this.email = email;
    this.headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US;q=0.7,en;q=0.3",
      "X-Requested-With": "XMLHttpRequest",
      Connection: "keep-alive",
      Referer: "https://www.minuteinbox.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
    };
  }
  static async create() {
    const headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US;q=0.7,en;q=0.3",
      "X-Requested-With": "XMLHttpRequest",
      Connection: "keep-alive",
      Referer: "https://www.minuteinbox.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
    };
    const {
      data: { email },
    } = await axios.get("https://www.minuteinbox.com/index/index", { headers });
    const url = "https://www.minuteinbox.com/expirace/568523";
    const cookie = `MI=${email};`;
    await axios.get(url, { headers: { ...headers, Cookie: cookie } });

    return email;
  }
  async getMonth() {
    const cookie = `MI=${this.email};`;
    const response = await axios.get(
      "https://www.minuteinbox.com/index/zivot",
      { headers: { ...this.headers, Cookie: cookie } }
    );
    console.log(response.data);
  }
  async getInbox() {
    const cookie = `MI=${this.email};`;
    const { data } = await axios.get(
      "https://www.minuteinbox.com/index/refresh",
      { headers: { ...this.headers, Cookie: cookie } }
    );
    return data;
  }
  async getMessages() {
    try {
      const data = await this.getInbox();
      const messages = await Promise.all(
        data.map(async (message) => {
          const id = message["id"];
          const data = this.getMessageContent(id);
          return {
            id: `${this.email} ${id}`,
            email: this.email,
            subject: message["predmet"],
            from: message["od"],
            timeAgo: message["kdy"],
            body: parseHtml(data),
          };
        })
      );
      return messages;
    } catch (error) {
      console.log("[ERR]");
    }
  }
  async verify() {
    let inboxes;
    let retry = 0;
    while (retry < 20) {
      const data = await this.getInbox();
      inboxes = data.filter((el) => {
        if (el["predmet"].includes("Verify")) {
          return true;
        }
        return false;
      });
      if (inboxes.length > 0) break;
      retry++;
      console.log("[INFO] Retry..." + retry);
    }
    if (retry === 20) throw new Error("Maximum Retry Exceed");

    const last = inboxes[0];
    const message = await this.getMessageContent(last["id"]);
    const $ = cheerio.load(message);
    return $('a:contains("Verify Email")').attr("href");
  }
  async getMessageContent(id) {
    const cookie = `MI=${this.email};`;
    const response = await axios.get(
      `https://www.minuteinbox.com/email/id/${id}`,
      { headers: { ...this.headers, Cookie: cookie } }
    );
    return response.data;
  }
}