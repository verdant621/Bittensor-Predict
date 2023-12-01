//Mail Manager
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { click, type, asyncForEach, waitForURL } from 'puppeteer-utilz'
import { wait, readFileAsync, writeFileAsync, executeCommand } from '../utils.js'
import path from 'path';
const stealth = StealthPlugin();
puppeteer.use(StealthPlugin());
stealth.enabledEvasions.delete('iframe.contentWindow');


export class MMail {
	constructor() {
		this.driver = null
	}
	async create() {
		const options = {
			defaultViewport: null,
			args: [
				'--start-maximized'
			],
			headless: 'new'
		}
		if (process.platform == 'linux') options.args.push('--no-sandbox');
		this.browser = await puppeteer.launch(options)
		const pages = await this.browser.pages()
		this.page = pages[0]
		await this.page.goto('https://www.minuteinbox.com/expirace/568523/')
		await this.page.waitForSelector('span#email')
		const element = await this.page.$('span#email')
		const email = await this.page.evaluate((el) => {
			return el.textContent
		}, element)

		return email
	}
	async verify() {
		while (true) {
			const isNow = await this.page.evaluate(() => {
				x = document.querySelectorAll("td.from")[0];
				if (x.textContent.trim() == "Upwork Notifications") {
					x.click();
					return true;
				}
				return false;
			})
			if (isNow) {
				break;
			}
			await wait(1000)

		}
		const iframeHandle = await this.page.waitForSelector('#iframeMail');
		const iframeContent = await iframeHandle.contentFrame();

		// Proceed with operations inside the iframe
		// For example, to interact with elements within the iframe:
		let link;

		while (true) {
			const inputElements = await iframeContent.$$('a');
			if (inputElements.length) {
				const href = await iframeContent.evaluate((el) => {
					return el.getAttribute('href');
				}, inputElements[1])
				console.log(href)
				link = href;
				break;
			}
			await wait(1000)

		}
		await this.browser.close()
		return link;
	}
}