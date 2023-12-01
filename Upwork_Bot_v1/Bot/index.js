import puppeteer from "puppeteer-extra";
import { click, delay, waitForNavigation, timeout } from "puppeteer-utilz";
import dotenv from "dotenv";

import { input, selectItem } from "./utils/upwork-tools.js";

import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { sample_answer } from "./utils/sample_answers.js";
import { createProposal } from "./utils/generate.js";
import { deleteUser, getActiveUser, updateStatus } from "./utils/db_handler.js";
const stealthPlugin = StealthPlugin();
puppeteer.use(stealthPlugin);
stealthPlugin.enabledEvasions.delete("iframe.contentWindow");

dotenv.config();

let last_job = null;
let processing = false;

const findAndSend = async (email, password = "P@ssw0rd123123") => {
  // Configuration
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

  let loginAndNavigate = (email, password = "P@ssw0rd123123") => {
    return new Promise(async (resolve, reject) => {
      try {
        await page.goto("https://www.upwork.com/ab/account-security/login");
        await input(page, "#login_username", email);
        await click({
          component: page,
          selector: "#login_password_continue",
        });

        await delay(1000);

        await input(page, "#login_password", password);
        await Promise.all([
          page.waitForNavigation({ timeout: 30000 }),
          click({
            component: page,
            selector: "#login_control_continue",
          }),
        ]);

        let fee_elements = await page.$$("div.modal-body.d-flex");
        if (fee_elements.length) {
          await click({
            component: page,
            selector: "div.modal-body.d-flex input",
          });

          await click({
            component: page,
            selector:
              "div.modal-body.d-flex button.up-btn.up-btn-primary:not([disabled])",
          });
        } else {
          await page.waitForSelector('div[role="dialog"] button');
          let close = await page.$$('div[role="dialog"] button');
          console.log(close);
          await close[2].click();
        }

        // await delay(3000);
        // await page.evaluate(() => {
        //   window.scrollBy(0, 500);
        // });

        resolve("Success"); // Resolves the promise with Success if everything goes well
      } catch (error) {
        reject(error); // Rejects the promise with an error if something goes wrong
      }
    });
  };

  try {
    await loginAndNavigate(email, password);
    console.log("success login!");
  } catch (error) {
    console.log("error on login: ", error);
    await deleteUser(process.argv[2], email);
    processing = false;
    page.close().then(() => {
      browser.close();
    });
    return;
  }

  await page.goto("https://www.upwork.com/nx/find-work/most-recent");

  let lock = 0;
  const max_limit = 50;
  let limit = max_limit;
  let intervalId = null;
  let boost = true;
  let coverletter = "";

  const getInfoFromJob = async (job) => {
    let info = {};
    if (!job) return info;

    const getTitle = async () => {
      let titleElement = await job.$("a");
      info.title = await titleElement.evaluate((element) =>
        element.textContent.trim()
      );
      info.href = await titleElement.evaluate((element) =>
        element.getAttribute("href")
      );
    };

    const getType = async () => {
      let typeElement = await job.$("strong[data-test='job-type']");
      info.job_type = await typeElement.evaluate((element) =>
        element.textContent.trim()
      );
    };

    const getBudget = async () => {
      let priceElement = await job.$("span[data-test='budget']");
      if (priceElement != null)
        info.fixed_price = await priceElement.evaluate((element) =>
          Number(element.textContent.trim().slice(1).replace(/,/g, ""))
        );
    };

    const getContent = async () => {
      let contentElement = await job.$(
        "span[data-test='job-description-text']"
      );
      info.content = await contentElement.evaluate((element) =>
        element.textContent.trim()
      );
    };

    const getCountry = async () => {
      let countryElement = await job.$(
        "small[data-test='client-country'] strong"
      );
      if (countryElement != null)
        info.country = await countryElement.evaluate((element) =>
          element.textContent.trim()
        );
    };

    await Promise.all([
      getTitle(),
      getType(),
      getBudget(),
      getContent(),
      getCountry(),
    ]);

    if (
      info.country === "India" ||
      info.country === "Pakistan" ||
      info.country === "Nigeria"
    ) {
      return { ...info, good: false };
    }
    // if (info.job_type === "Fixed-price" && info.fixed_price < 1000) {
    //   return { ...info, good: false };
    // }
    if (info.title && info.title.includes("Expensify")) {
      return { ...info, good: false };
    }

    return { ...info, good: true };
  };

  const reset = async () => {
    lock = 1;

    console.log("Resetting ...");
    stop();

    await page.reload();
    await page.goto("https://www.upwork.com/nx/find-work/most-recent");
    // await page.evaluate(() => {
    //   window.scrollBy(0, 500);
    // });

    await delay(1000 * 30);

    lock = 0;
    limit = max_limit;
    start();
  };

  const apply = async () => {
    console.log("Applying...");

    function getElements(page) {
      let total;
      let numTxt;
      let gap;

      return new Promise((resolve, reject) => {
        page
          .$$("div.fe-proposal-additional-details.additonal-details textarea")
          .then((el) => {
            total = el.length;
            return page.$$(
              "div.fe-proposal-additional-details.additonal-details label"
            );
          })
          .then((el) => {
            numTxt = el.length;
            gap = numTxt - total;
            console.log("ready for coverletter");
            resolve({ total, numTxt, gap });
          })
          .catch(reject);
      });
    }

    let { total, numTxt, gap } = await getElements(page);

    console.log(total, numTxt, gap);

    function doWork(numTxt, gap, total, label = "", text = "") {
      if (numTxt - gap <= 0) {
        console.log("done");
        return Promise.resolve();
      }

      if (numTxt === total + gap) {
        console.log("CV to bid: ", coverletter);
        text = coverletter;
      } else {
        if (label.includes("similar")) {
          text = sample_answer.portfolio_url;
        } else if (label.includes("frameworks")) {
          text = sample_answer.frameworks;
        } else if (label.includes("GitHub")) {
          text = sample_answer.github_url;
        } else if (label.includes("testing")) {
          text = sample_answer.QA_methods;
        } else if (label.includes("certification")) {
          text = sample_answer.certification;
        } else {
          text = "let's discuss via private message";
        }
      }

      return page
        .$$eval(
          "div.fe-proposal-additional-details.additonal-details textarea",
          (elements, index, txt) => {
            elements[index].value = txt;
          },
          total - numTxt + gap,
          text
        )
        .then(() => {
          return page.$$(
            "div.fe-proposal-additional-details.additonal-details textarea"
          );
        })
        .then((el) => {
          return el[total - numTxt + gap].click();
        })
        .then(() => {
          return page.keyboard.type(" ");
        })
        .then(() => {
          return numTxt - 1;
        })
        .then((ret) => {
          numTxt = ret;
          return page.$$eval(
            "div.fe-proposal-additional-details.additonal-details label",
            (elements, gap, index) => {
              if (gap == 2) return elements[index + 2].textContent.trim();
              else if (gap == 1) return elements[index].textContent.trim();
            },
            gap,
            total - numTxt
          );
        })
        .then((el) => {
          if (numTxt - gap > 0) {
            label = el;
            console.log(el);
          }
          //Recursion here
          return doWork(numTxt, gap, total, label, text);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }

    return doWork(numTxt, gap, total);
  };

  const submit = () => {
    return new Promise((resolve, reject) => {
      let timing;

      const runPromise = (_page) => {
        return Promise.all([
          click({
            component: _page,
            selector: 'div[role="dialog"] input[type="checkbox"]',
          }),
          click({
            component: _page,
            selector:
              'div[role="dialog"] button.up-btn.up-btn-primary.m-0.btn-primary',
          }),
        ]);
      };

      timing = setInterval(() => runPromise(page), 1000);
      setTimeout(() => clearInterval(timing), 3000);

      Promise.all([
        click({
          component: page,
          selector: "footer button",
        }),
        page.waitForNavigation(),
      ])
        .then(() => {
          clearInterval(timing);
          if (page.url().includes("?success")) {
            // success
            console.log("Your Proposal was submitted!");
            resolve("Your Proposal was submitted!");
          } else {
            reject("Submission failed!");
          }
        })
        .catch((error) => {
          // failure
          console.log("error: ", error);
          reject(error);
        });
    });
  };

  const sendProposal = async (job) => {
    if (job.href) {
      console.log("sending Proposal...");
      page
        .goto(`https://www.upwork.com${job.href}`)
        .then(() => {
          return page.$('button[aria-label="Apply Now"]:not([disabled])');
        })
        .then(async (ret) => {
          if (ret) {
            return click({
              component: page,
              selector: 'button[aria-label="Apply Now"]:not([disabled])',
            });
          } else {
            console.log("Can't find apply button");
            await deleteUser(process.argv[2], email);
            throw new Error("Cannot Apply");
          }
        })
        .then(() => {
          // wait for navigation to job detail page
          return waitForNavigation(page, timeout("15 seconds"));
        })
        .then(() => {
          // wait till page is rendered
          return page.waitForSelector("footer button");
        })
        .then(() => {
          return page.$$('input[value="default"]').then((el) => {
            if (el.length) {
              return click({
                component: page,
                selector: 'input[value="default"]',
              });
            }
          });
        })
        .then(() => {
          return page.$$("div.up-dropdown-icon.up-icon").then((el) => {
            console.log(el.length);
            return el.length;
          });
        })
        .then(async (ret) => {
          if (ret) {
            if (ret == 1)
              await selectItem(
                page,
                "div.up-dropdown-icon.up-icon",
                "span.up-menu-item-text",
                3,
                500
              );
            if (ret == 2)
              await selectItem(
                page,
                "div.sri-form-card div.up-dropdown-icon.up-icon",
                "span.up-menu-item-text",
                0,
                500
              );
            if (ret == 3) {
              await selectItem(
                page,
                "div.up-dropdown-icon.up-icon",
                "span.up-menu-item-text",
                3,
                500
              );
              await selectItem(
                page,
                "div.sri-form-card div.up-dropdown-icon.up-icon",
                "span.up-menu-item-text",
                0,
                500
              );
            }
            return true;
          }
        })
        .then(async () => {
          return await apply();
        })
        .then(() => {
          // find boost button
          return page.$$("button.up-btn.up-btn-default.m-0");
        })
        .then((el) => {
          if (!el.length) {
            // no boost button
            console.log("Ready for proposal [no boost button]");
          } else {
            return click({
              component: page,
              selector: "button.up-btn.up-btn-default.m-0",
            });
          }
        })
        .then(() => {
          return page.$("#boost-bid-amount");
        })
        .then((ret) => {
          if (ret == null) {
            boost = false;
            return false;
          }
          return page.focus("#boost-bid-amount");
        })
        .then(() => {
          if (boost) return page.keyboard.press("Backspace");
        })
        .then(() => {
          if (boost) return page.keyboard.press("Backspace");
        })
        .then(() => {
          if (boost) return page.keyboard.type("50");
        })
        .then(() => {
          if (boost)
            return click({
              component: page,
              selector: "button.up-btn.up-btn-default.up-btn-sm.m-0",
            });
        })
        .then(() => {
          if (!boost) {
            console.log("not boosted");
          } else {
            console.log("boosted");
          }
          console.log("Ready for proposal");
        })
        .then(async () => {
          return await submit();
        })
        .then(() => {
          page.close().then(() => {
            browser.close();
          });
        })
        .then(async () => {
          await updateStatus(process.argv[2], email);
        })
        .then(() => {
          processing = false;
        })
        .catch((error) => {
          // page.screenshot({ path: `error.png` });
          console.log("error: ", error);
          processing = false;
          last_job = null;
          page.close().then(() => {
            browser.close();
          });
        });
    } else {
      // error on sending proposal, restart seeking new job
      page.goto("https://www.upwork.com/nx/find-work/most-recent").then(() => {
        start();
      });
      return;
    }
  };

  const getLatestJob = async () => {
    console.log("Job seeking.....");
    if (lock == 1) {
      console.log("Checking reset ...");
      return;
    }
    limit = limit - 1;

    // move to "saved jobs" tab
    let saved = await page.$x(
      "//button[contains(@class, 'up-tab-btn') and contains(text(), 'Saved')]"
    );
    await Promise.all([page.waitForNavigation(), saved[0].click()]);

    // move to "most recent jobs" tab
    let most = await page.$x(
      "//button[contains(@class, 'up-tab-btn') and contains(text(), 'Most')]"
    );

    try {
      await Promise.all([page.waitForNavigation(), most[0].click()]);
    } catch (error) {
      console.log("error: ", error);
      await reset();
      return;
    }

    // wait until job lists display
    try {
      await page.waitForSelector("div[data-test='job-tile-list'] section");
    } catch (error) {
      console.log("Error-can't find job list:", error);
      await reset();
      return;
    }

    // get the job in the top
    const job = await page.$("div[data-test='job-tile-list'] section");

    // check if it's a new job
    let info = await getInfoFromJob(job);
    if (info.href && last_job?.href !== info.href && !!info?.good) {
      console.log(`Discovered latest job ...: `, info);
      last_job = info;
      stop();

      const generateCV = async (info) => {
        coverletter = await createProposal(info.content);
        console.log("CV from GPT: ", coverletter);
      };
      // start bidding to the found job
      await Promise.all([generateCV(info), sendProposal(info)]);
    } else {
      console.log("No new job posted");
      // await page.reload();
    }

    // reset every 50th refresh
    if (!limit) {
      await reset();
    }
  };

  // start seeking for the latest job
  const start = () => {
    intervalId = setInterval(getLatestJob, 1000 * 7);
  };

  // stop seeking for the latest job
  const stop = () => {
    clearInterval(intervalId);
  };

  getLatestJob();
  start();
};

(async () => {
  // loop sending proposals
  // node[0] index.js[1] william[2]
  while (true) {
    if (processing) {
      await delay(5000);
      continue;
    }
    const user = await getActiveUser(process.argv[2]);
    if (user) {
      console.log("Active user found: ", user.email);
      processing = true;
      await findAndSend(user.email);
    } else {
      console.log("No active user found");
      // wait for 10 min
      await delay(1000 * 60 * 10);
    }
  }
})();
