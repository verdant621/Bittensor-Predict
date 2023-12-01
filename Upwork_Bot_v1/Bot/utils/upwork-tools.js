import { click, delay } from "puppeteer-utilz";

export const waitForSelector = async (
  page,
  selector1,
  ind,
  selector2,
  time
) => {
  let index = 0;
  let el;
  while (true) {
    if (index == 5) throw new Error("Time out Error!");

    el = await page.$$(selector1);
    if (ind >= el.length) continue;

    await el[ind].click();

    await delay(time);

    index = index + 1;

    let pass = await page.$$(selector2);
    if (pass.length) break;
  }
};

export const waitForUrl = async (page, selector1, ind, url, time) => {
  let index = 0;
  let el;
  while (true) {
    if (index == 5) throw new Error("Time out Error!");

    el = await page.$$(selector1);
    if (ind >= el.length) continue;

    await el[ind].click();

    await delay(time);

    index = index + 1;

    if (page.url().includes(url)) break;
  }
};

export const waitForNotUrl = async (page, selector1, ind, url, time) => {
  let index = 0;
  let el;
  while (true) {
    if (index == 5) throw new Error("Time out Error!");

    el = await page.$$(selector1);
    if (ind >= el.length) continue;

    await el[ind].click();

    await delay(time);

    index = index + 1;

    if (!page.url().includes(url)) break;
  }
};

export const selectMenu = async (
  page,
  button_selector,
  ind,
  key,
  selector,
  mode
) => {
  await delay(500);

  await waitForSelector(
    page,
    button_selector,
    ind,
    selector.split("::")[0],
    1500
  );

  if (mode == "search") {
    let search = selector.split("::")[0];
    let sel = selector.split("::")[1];

    await page.type(search, key);

    await page.waitForSelector(sel);

    let indexes = await page.$$eval(sel, (elements) => {
      return elements.map((el) => el.textContent);
    });
    let index;
    for (let i = 0; i < indexes.length; i++) {
      if (indexes[i].includes(key)) {
        index = i;
        break;
      }
    }
    let menus = await page.$$(sel);
    await menus[index].click();
  } else {
    let indexes = await page.$$eval(selector, (elements) => {
      return elements.map((el) => el.textContent);
    });
    let index;
    for (let i = 0; i < indexes.length; i++) {
      if (indexes[i].includes(key)) {
        index = i;
        break;
      }
    }
    let menus = await page.$$(selector);
    await menus[index].click();
  }

  await delay(500);
};

export const input = async (page, selector, key, time = 0) => {
  await page.waitForSelector(selector);
  return await page.type(selector, key, { delay: time });
};

export const selectItem = async (page, selector1, selector2, index, time) => {
  while (true) {
    await click({
      component: page,
      selector: selector1,
    });

    await delay(time);

    let pass = await page.$$(selector2);
    if (pass.length) {
      await pass[index].click();
      break;
    }
  }
};
