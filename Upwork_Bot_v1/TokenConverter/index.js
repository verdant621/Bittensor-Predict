/*
    Author: WeiJie Lim
*/

import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { click, type, asyncForEach, waitForURL } from 'puppeteer-utilz'
import { wait, readFileAsync, writeFileAsync, executeCommand } from './utils.js'
import path from 'path';
import dotenv from 'dotenv'
import fs from 'fs';
import { saveAccount } from './db.js';
const stealth = StealthPlugin();
puppeteer.use(StealthPlugin());
stealth.enabledEvasions.delete('iframe.contentWindow');
dotenv.config();


// let browser
// let page
let password
const pathToScreen = path.join(process.cwd(), 'screenshot.png')
const pathToError = path.join(process.cwd(), 'error.png')

let escape;

async function waitForSelector(page, selector1, selector2, time) {
    let index = 0;
    while (true) {
        if (index == 5) throw new Error('Time out Error!');
        index = index + 1;
        await click({
            component: page,
            selector: selector1
        })

        await wait(time);

        let pass = await page.$$(selector2);
        if (pass.length) break;
    }
}


async function waitForUrl(page, selector1, url, time) {
    let index = 0;
    while (true) {
        if (index == 5) throw new Error('Time out Error!');
        index = index + 1;
        await click({
            component: page,
            selector: selector1
        })

        await wait(time);

        if (page.url().includes(url)) break;
    }
}

async function selectMenu(page, button_selector, key, selector, mode, index = 0) {
    await wait(500)
    if (index == 0) {
        await waitForSelector(page, button_selector, selector, 3000);
        // await click({
        //     component: page,
        //     selector: button_selector
        // })

        if (mode == 'search') {
            await type(page, {
                selector: selector,
                value: key
            })
            await wait(100)
            await page.keyboard.press('Tab')
            await page.keyboard.press('Tab')
            await page.keyboard.press('Enter')
        } else {
            let indexes = await page.$$eval(selector, (elements) => {
                return elements.map(el => el.textContent)
            })
            let index
            for (let i = 0; i < indexes.length; i++) {
                if (indexes[i].includes(key)) { index = i; break }
            }
            let menus = await page.$$(selector)
            await menus[index].click()
        }
    } else {
        for (let i = 0; i < index; i++) {
            await page.keyboard.press('Tab')
        }
        await page.keyboard.press('Space')
        await page.waitForSelector(selector)
        if (mode == 'search') {
            await type(page, {
                selector: selector,
                value: key
            })
            await page.keyboard.press('Tab')
            await page.keyboard.press('Tab')
            await page.keyboard.press('Enter')
        } else {
            let indexes = await page.$$eval(selector, (elements) => {
                return elements.map(el => el.textContent)
            })
            let index
            for (let i = 0; i < indexes.length; i++) {
                if (indexes[i].includes(key)) index = i
            }
            let menus = await page.$$(selector)
            await menus[index].click()
        }
    }
    await wait(500)
}

async function handleDropDown(page, btnSelector, inputSelector, searchWord, itemSelector){
    await page.waitForSelector(btnSelector)
    const btn = await page.$(btnSelector)
    await btn.click()
    await page.waitForSelector(inputSelector)
    // const inp = await page.$(inputSelector)
    await type(page, {
        selector: inputSelector, 
        value: searchWord
    })
    await page.waitForSelector(itemSelector)
    await click({
        component: page,
        selector: itemSelector
    })
}

function getFakeEmail() {
    // Get only original username from Gmail
    const originEmail = process.env.MAIN;
    const originalUsername = originEmail.split('@')[0];

    // Generate a random string of characters for the username and random number
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 10; i++) {
        username += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const randnum = String(Date.now());

    // Combine the original username, random username, and random number to create a fake email address
    return `${originalUsername}+${username}${randnum}@gmail.com`;
}

async function input(page, selector, key, delay = 0) {
    await page.waitForSelector(selector);
    await page.type(selector, key, { delay: delay })
}

async function fillOutLanguage(page, languages=[]){
    console.log('Fill Out')
    // fill out the english.
    await page.evaluate(()=>{
        const engBtn = document.querySelector('label#dropdown-label-english ~ div > div > div')
        engBtn.click()
        setTimeout(()=>{
            const menus = document.querySelectorAll('span.air3-menu-item-text')
            menus[2].click()
        }, 200)

    })
    await wait(100)
    
    const otherLangs = await page.$$('div[data-qa="other-languages"]')
    console.log(otherLangs)
    for(let index=0; index < otherLangs.length; index++){
            try {
                const other_language = otherLangs[index]
                const level = languages[index]['pro'] * 1
                const toggle = await other_language.$$('div[data-test="dropdown-toggle"]')
                await toggle[1].click()
                await wait(200)
                const menu = await page.$$("div[data-test='menu-container'] li")
                await menu[level].click()
                await wait(200)
            }catch(e){
                console.log('[ERR]', e)
            }
        }

}

async function Login(profile, fake) {
    const pathToExtension = path.join(process.cwd(), 'extensions/cookies')
    let options = {
        defaultViewport: null,
        args: [
           // `--disable-extensions-except=${pathToExtension}`,
            //`--load-extension=${pathToExtension}`,
            '--start-maximized'
        ]
    }

    let headless = process.env.HEADLESS;
    options.headless = headless
    if (headless == 'false') options.headless = false
    console.log(options.headless)

    if (process.platform == 'linux') options.args.push('--no-sandbox');

    const browser = await puppeteer.launch(options);
    const pages = await browser.pages()

    const page = pages[0]


    await page.goto('chrome://settings/');
    await page.evaluate(() => {
        chrome.settingsPrivate.setDefaultZoom(0.5);
    })

    try {
        await page.setRequestInterception(true);

        page.on('request', (request) => {
            request.continue();
        });

        await page.setCacheEnabled(false);

        await page.goto('https://www.upwork.com/nx/signup/?dest=home', { timeout: 60000 })
        await click({
            component: page,
            selector: 'input[name="radio-group-2"]'
        })

        await click({
            component: page,
            selector: 'button[data-qa="btn-apply"]'
        })

        await input(page, '#first-name-input', profile['first_name'])
        await input(page, '#last-name-input', profile['last_name'])
        await input(page, '#redesigned-input-email', fake)
        await input(page, '#password-input', password)
        

        let value = false;
        let trying = 0;

        while (!value) {
            if (trying == 5) return false;
            trying = trying + 1;
            await click({
                component: page,
                selector: '#checkbox-terms'
            })

            value = await page.$eval('#checkbox-terms', (el) => {
                return el.value;
            });

            console.log(value);
        }

        await Promise.all([
            page.waitForNavigation({ timeout: 60000 }),
            click({
                component: page,
                selector: '#button-submit-form'
            })
        ]);

        let href = '';

        console.log('[Info] Verifying ...');

        trying = 0;

        while (true) {
            if (trying == 10) return false;
            trying = trying + 1;
            const pathToMail = path.join(process.cwd(), 'read_email.py')
            href = await executeCommand(`python ${pathToMail} ${fake}`)
            console.log(`Log => ${href}`);

            await page.goto(href, { timeout: 45000 });
            await wait(5000);

            let url = page.url();
            console.log(url);
            if (url.includes('create')) {
                break;
            }
        }

        await waitForSelector(page, 'button[data-qa="get-started-btn"]', 'input[value="FREELANCED_BEFORE"]', 3000);

        await click({
            component: page,
            selector: 'input[value="FREELANCED_BEFORE"]'
        })
        await Promise.all([
            page.waitForNavigation(),
            click({
                component: page,
                selector: 'button[data-test="next-button"]'
            })
        ])

        await click({
            component: page,
            selector: 'input[value="GET_EXPERIENCE"]'
        })

        await Promise.all([
            page.waitForNavigation(),
            click({
                component: page,
                selector: 'button[data-test="next-button"]'
            })
        ])

        await click({
            component: page,
            selector: 'input[type="checkbox"]'
        })

        await Promise.all([
            page.waitForNavigation(),
            click({
                component: page,
                selector: 'button[data-test="next-button"]'
            })
        ])


        await click({
            component: page,
            selector: 'button[data-qa="resume-upload-btn-mobile"]'
        });

        const pathToCV = path.join(process.cwd(), `profiles/${process.argv[2]}.docx`)
        await page.waitForSelector('input[type="file"]')
        const cv = await page.$('input[type="file"]')
        cv.uploadFile(pathToCV)

        await page.waitForSelector('button[data-qa="resume-upload-continue-btn"]:not([disabled])')

        await click({
            component: page,
            selector: 'button[data-qa="resume-upload-continue-btn"]:not([disabled])'
        })

        await page.waitForSelector('input[aria-labelledby="title-label"][type="text"]');
        await page.evaluate(() => document.querySelector('input[aria-labelledby="title-label"][type="text"]').value = "")
        await page.type('input[aria-labelledby="title-label"][type="text"]', profile['professional']);

        // await page.focus('button[data-test="next-button"]');

        await Promise.all([
            page.waitForNavigation(),
            click({
                component: page,
                selector: 'button[data-test="next-button"]'
            })
        ])

        await Promise.all([
            page.waitForNavigation(),
            click({
                component: page,
                selector: 'button[data-test="next-button"]'
            })
        ])

        await Promise.all([
            page.waitForNavigation(),
            click({
                component: page,
                selector: 'button[data-test="next-button"]'
            })
        ])

        //// skip certificates
        let url = page.url()
        if (!url.includes('https://www.upwork.com/nx/create-profile/languages')) {
            await Promise.all([
                page.waitForNavigation(),
                click({
                    component: page,
                    selector: 'button[data-test="skip-button"]'
                })
            ])
        }
        await fillOutLanguage(page, profile['languages'])
        await waitForUrl(page, 'button[data-test="next-button"]', 'skill', 3000);

        //// add Skills
        let skills = profile['skills']

        await page.type('input[aria-labelledby="skills-input"]', ' ', { delay: 100 });
        for (let i = 0; i < skills.length; i++) {
            await page.type('input[aria-labelledby="skills-input"]', skills[i], { delay: 100 });
            await wait(500);
            await page.keyboard.press('ArrowDown')
            await page.keyboard.press('Enter')
        }

        await waitForUrl(page, 'button[data-test="next-button"]', 'overview', 3000);

        //// add Overview
        let overview = profile['overview']
        await page.waitForSelector('textarea[aria-labelledby="overview-label"]')
        await page.$eval('textarea[aria-labelledby="overview-label"]', (el, txt) => {
            el.value = txt;
        }, overview);
        await click({
            component: page,
            selector: 'textarea[aria-labelledby="overview-label"]'
        })
        await page.type('textarea[aria-labelledby="overview-label"]', ' ')

        await waitForUrl(page, 'button[data-test="next-button"]', 'categories', 3000);

        //// add Service
        let services = profile['services']
        await click({
            component: page,
            selector: 'div[aria-labelledby*="dropdown-search-multi-label"]'
        })
        let selector = 'span.air3-menu-checkbox-labels'
        await page.waitForSelector('span.air3-menu-checkbox-labels')
        let servicelist = await page.$$(selector)
        let toselect = -1
        for (let i = 0; i < services.length; i++) {
            for (let j = 0; j < servicelist.length; j++) {
                let text = await page.evaluate((index, selector) => {
                    const items = Array.from(document.querySelectorAll(selector))
                    return items[index].textContent
                }, j, selector);
                if (text.includes(services[i])) {
                    toselect = j
                    break
                }
            }

            if (toselect != -1) {
                let select = await page.evaluate((index, selector) => {
                    const items = Array.from(document.querySelectorAll(selector))
                    return items[index].parentNode.parentNode.getAttribute('aria-selected')
                }, toselect, selector);
                if (select == 'false') {
                    await page.evaluate((index, selector) => {
                        const items = Array.from(document.querySelectorAll(selector))
                        return items[index].parentNode.parentNode.parentNode.parentNode.parentNode.click()
                    }, toselect, selector);
                    await wait(300)
                    await page.evaluate((index, selector) => {
                        const items = Array.from(document.querySelectorAll(selector))
                        return items[index].parentNode.parentNode.click()
                    }, toselect, selector)
                }
            }
        }

        await waitForUrl(page, 'button[data-test="next-button"]', 'rate', 3000);

        //// set rate
        await input(page, 'input[data-ev-label="currency_input"]', profile['hourRate'])
        await waitForUrl(page, 'button[data-test="next-button"]', 'location', 3000);

        //// check profile
        console.log('[INFO] fill out the address info')
        await handleDropDown(page, '#country-label ~ div > div > div', 'div.air3-dropdown-menu div.air3-dropdown-search input', profile['country'], 'div.air3-menu-container ul > li')
        await input(page, 'input[aria-labelledby="street-label"]', profile['street'])
        await input(page, 'input[aria-labelledby="city-label"]', ' ' + profile['city'])
        await wait(1500)
        await click({
            component: page,
            selector: 'span.air3-menu-item-text',
            retries: 3
        })
        await input(page, 'input[aria-labelledby="postal-code-label"]', profile['zipcode'])
        await input(page, 'input[aria-labelledby^="dropdown-label-phone-number"]', profile['phone'])
        await click({
            component: page,
            selector: 'button[data-qa="open-loader"]'
        })
        const pathToPicture = path.join(process.cwd(), "profiles", profile['avatar'])
        await page.waitForSelector('input[type="file"]')
        const upload = await page.$('input[type="file"]')
        upload.uploadFile(pathToPicture)

        await page.waitForSelector('button[data-qa="btn-delete"]')
        await click({
            component: page,
            selector: 'button[data-qa="btn-save"]'
        })

        const now = new Date().getTime();
        while (true) {
            let s = await page.$$('button[data-qa="btn-save"]');
            if (!s.length) break;
            if (new Date().getTime() - now > 50000) {
                return false;
            }
        }

        await waitForSelector(page, 'button[data-test="next-button"]', 'button[data-qa="submit-profile-top-btn"]', 3000);

        await waitForUrl(page, 'button[data-qa="submit-profile-top-btn"]', 'finish', 3000);

        console.log('Account has been created successfully.');

        await page.goto('https://www.upwork.com/ab/notification-settings/', { timeout: 45000 });

        await page.waitForSelector('div[aria-labelledby*="email-unread-activity"]');
        await page.$$eval('div[aria-labelledby*="email-unread-activity"]', (el) => {
            el[1].click();
        });

        await wait(2000);

        await page.keyboard.press('ArrowUp')
        await page.keyboard.press('Enter')

        await wait(2000);

        console.log('Notification settings success!');
        console.log(`[:Info] Save New Account`)
        saveAccount({
            email: fake,
            name: process.argv[2]
        })
	console.log('[INFO] Success')
        // const pathToHere = path.join(process.cwd(), 'here.py')
        // await executeCommand(`cd ${process.cwd()} & python ${pathToHere} ${process.argv[2]} ${fake}`)
    } catch (error) {
        console.log(error);
    } finally {
        await page.close();
        await browser.close();
        return true;
    }
	
}


async function main(number) {
    try {
        // disableLogger();

        console.log(number);

        const pathToProfile = path.join(process.cwd(), `profiles`, process.argv[2] + '.json')
        let profile = await readFileAsync(pathToProfile)
        profile = JSON.parse(profile)

        let fake = false;

        let trying = 0;

        while (!fake) {
            if (trying == 3) return false;
            trying = trying + 1;
            fake = getFakeEmail();
            console.log(`Log => ${fake}`)
        }

        // else if (mode == 'txt') fake = await getFakeEmailFromTxt()

        let ret = await Login(profile, fake);
        console.log(ret);
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}


(async () => {
    const array = Array.from({ length: eval(process.argv[3]) }, (_, index) => index + 1);

    if (process.platform == 'win32') {
        escape = '\r\n';
    } else if (process.platform == 'linux') {
        escape = '\r';
    }

    password = process.env.PASSWORD;
    let mode = 'temp';

    await asyncForEach(array, main);

    process.exit()
})()