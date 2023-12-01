// telegram bot
import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { FakeMail } from "./db.js";
// import path from 'path'
// import { fileURLToPath } from 'url';
import Database from "./lib/mongodb.js";
import { GeneratorMail } from "./lib/inbox.js";
import { getTimeDiff } from "./lib/utils.js";

dotenv.config();

function filterUser(context, user) {
  if (context.message.from.username !== user) {
    context.reply("はじめまして！😉どのように手伝えますか？");
    return false;
  }
  return true;
}

async function getMessages(email) {
  const mail = new GeneratorMail(email);
  const messages = await mail.getMessages();
  return messages;
}
async function checkEmail(email, callback, mail) {
  const messages = await getMessages(email);
  if (messages.length) console.log(messages);
  await Promise.all(
    messages.map(async (message) => {
      const isExist = await mail.isNewNotification(message.id);
      if (isExist.length === 0) {
        // console.log('Save')
        await mail.saveNotification(message.id);
        await callback(
          `  👋New message\n From: ${
            message.fromEmail
          } \nTo: ${email} \nTitle: ${message.subject} - ${getTimeDiff(
            message.timestamp
          )}`
        );
      }
    })
  );
}

// async function check(ctx) {
// 	console.log('[INFO] Start New Iteration')
// 	const emails = await findMMails();
// 	console.log(`[INFO] ${emails.length} have been applied.`)
// 	await Promise.all(emails.map(async email => {
// 		await checkEmail(email, ctx)
// 	}
// 	))
// 	console.log('[INFO] Finish Iteration')
// }

async function main() {
  const db = new Database(process.env.MONGO_URI);
  await db.connect();
  const fakeMail = new FakeMail(db);
  let interval;
  let isRunning = false;
  const bot = new Telegraf(process.env.BOT_KEY);
  bot.start((ctx) => {
    if (!filterUser(ctx, process.env.TELEGRAM_USER)) return;
    ctx.reply("Hello!");
    ctx.reply("/go");
  });
  bot.command("go", async (ctx) => {
    const chat_id = ctx.chat.id;
    if (!filterUser(ctx, process.env.TELEGRAM_USER)) return;
    if (isRunning) {
      await ctx.reply("Bot is currently running.");
      return;
    }
    await ctx.reply("Bot has been started.");

    const iterate = async () => {
      console.log("[INFO] Start New Iteration");
      const emails = await fakeMail.getAll();
      console.log(`[INFO] ${emails.length} have been applied.`);
      await Promise.all(
        emails.map(async (email) => {
          await checkEmail(
            email["email"],
            (e) => bot.telegram.sendMessage(chat_id, e),
            fakeMail
          );
        })
      );
      console.log("[INFO] Finish Iteration");
    };

    await iterate();

    interval = setInterval(async () => {
      await iterate();
    }, process.env.TIMEOUT * 1000);
    isRunning = true;
  });
  bot.command("stop", async (ctx) => {
    if (!filterUser(ctx, process.env.TELEGRAM_USER)) return;
    if (isRunning) {
      console.log("[INFO] Stopping Bot");
      clearInterval(interval);
      isRunning = false;
      ctx.reply("Bot has been stopped.");
    } else {
      ctx.reply("Bot is currently idle.");
    }
  });
  bot.launch();

  process.once("SIGINT", () => {
    bot.stop("SIGINT");
    db.close();
  });
  process.once("SIGTERM", () => {
    bot.stop("SIGTERM");
    db.close();
  });

  console.log("[INFO] Bot has started");
}
main();
