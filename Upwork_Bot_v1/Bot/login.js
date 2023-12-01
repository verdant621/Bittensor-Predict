import puppeteer from "puppeteer-extra";
import { click, delay } from "puppeteer-utilz";

import { input } from "./utils/upwork-tools.js";

import StealthPlugin from "puppeteer-extra-plugin-stealth";
const stealthPlugin = StealthPlugin();
puppeteer.use(stealthPlugin);
stealthPlugin.enabledEvasions.delete("iframe.contentWindow");

const loginbyEmail = async (email, password = "P@ssw0rd123123") => {
  let options = {
    headless: false,
    args: [
      "--js-flags=--expose-gc",
      `--force-device-scale-factor=0.75`,
      "--start-maximized",
    ],
  };

  if (process.platform === "linux") options.args.push("--no-sandbox");

  const browser = await puppeteer.launch(options);
  let page = await browser.newPage();

  await page.evaluate(() => gc());
  const client = await page.target().createCDPSession();

  await client.send("HeapProfiler.enable");
  await client.send("HeapProfiler.collectGarbage");
  await client.send("HeapProfiler.disable");

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (request.resourceType() == "fetch") {
      if (request.url().includes("site-messaging")) request.abort();
      else request.continue();
    } else request.continue();
  });

  await page.setCacheEnabled(false);

  // start login
  await page.goto("https://www.upwork.com/ab/account-security/login");
  await input(page, "#login_username", email);
  await click({
    component: page,
    selector: "#login_password_continue",
  });

  await delay(1000);
  await input(page, "#login_password", password);
  await Promise.all([
    page.waitForNavigation({ timeout: 60000 }),
    click({
      component: page,
      selector: "#login_control_continue",
    }),
  ]);

  // await page.waitForSelector('div[role="dialog"] button');
  // let close = await page.$$('div[role="dialog"] button');
  // console.log(close);
  // await close[2].click();

  // await delay(3000);
  // await page.evaluate(() => {
  //   window.scrollBy(0, 500);
  // });

  console.log("success login!");
};

await loginbyEmail(process.argv[2]);
