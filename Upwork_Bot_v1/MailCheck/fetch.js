// telegram bot
import dotenv from "dotenv";
import { FakeMail } from "./db.js";
import fs from "fs";
import Database from "./lib/mongodb.js";
import { GeneratorMail } from "./lib/inbox.js";
import GMail from "./lib/gmail.js";
import axios from "axios";
import cheerio from "cheerio";
import { getTimeDiff } from "./lib/utils.js";
const baseUrl = "https://generator.email/";

dotenv.config();

async function getDetail(link) {
  try {
    const chunks = link.split("/");
    // console.log(chunks)

    const headers = {
      Cookie: `embx=%5B%22${chunks[5]}%40${chunks[4]}%22%5D; surl=${chunks[4]}%2F${chunks[5]}%2F${chunks[6]}`,
    };
    const body = await axios.get(link, { headers });
    const $ = cheerio.load(body.data);
    return $("#message").parent().find("table").html();
  } catch (e) {
    return "";
  }
}

async function getMessages(email) {
  const mail = new GeneratorMail(email);
  const messages = await mail.getMessages();
  return messages;
}
async function checkEmail(email, callback, mail) {
  const messages = await getMessages(email);

  await Promise.all(
    messages.map(async (message) => {
      const isExist = await mail.isNewNotification(message.id);
      if (isExist.length === 0) {
        console.log(email);
        console.log("[INFO] New Message");
        console.log(messages);
        await mail.saveNotification(message.id);
        const detail = await getDetail(baseUrl + message.link);
        await callback({
          to: process.env.EMAIL,
          from: email,
          subject: message.subject,
          message: `<html>
						<body>
						<div style="background-color:green; color: aliceblue;">
						👋New message From 
            <a href="mailto:${email}">${email}</a>
						<p>${getTimeDiff(message.timestamp)}</p>
					
					  </div>
            <div style="width: 100%; display: flex; justify-content: space-evenly;">
					  ${detail}
            </div>
					  </body>
					  </html>`,
        });
      }
    })
  );
}

const main = async () => {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  console.log("[INFO] Database Connected.");
  const fakeMail = new FakeMail(db);
  const token = fs.readFileSync("./credentials/token.json");
  const gmail = new GMail(JSON.parse(token.toString()));
  let interval;

  const iterate = async () => {
    console.log("=====================");
    console.log("[INFO] Start New Iteration");
    const emails = await fakeMail.getAll();
    // const emails = [{'email': 'scrappingd394ffdc26ce6897@woaddd.shop'}];
    console.log(`[INFO] ${emails.length} have been applied.`);
    await Promise.all(
      emails.map(async (email) => {
        await checkEmail(email["email"], (e) => gmail.sendMail(e), fakeMail);
      })
    );
    console.log("[INFO] Finish Iteration");
  };

  await iterate();
  interval = setInterval(async () => {
    await iterate();
  }, process.env.TIMEOUT * 1000);
  process.once("SIGINT", () => {
    clearInterval(interval);
    db.close();
  });
  process.once("SIGTERM", () => {
    clearInterval(interval);
    db.close();
  });
};

await main();
