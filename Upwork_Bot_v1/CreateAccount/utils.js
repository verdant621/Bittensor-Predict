// utility for project

import readline from 'readline'
import fs from 'fs'
import { exec } from "child_process"


export function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(error.message)
                reject(new Error(`Error: ${error.message}`));
                return;
            }
            if (stderr) {
                console.log(stderr)
                reject(new Error(`Stderr: ${stderr}`));
                return;
            }
            resolve(stdout);
        });
    });
}




export const getTimestamp = ()=>{
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    return formattedTime
}
export function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise(resolve => {
        rl.question(question, input => resolve(input))
    })
}


export function Logger(message) {
    return new Promise(resolve => {
        console.log('Log => ' + JSON.stringify(message))
        resolve()
    })
}


export function wait(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds)
    })
}


async function iframeAttached(page, url, num) {
    return new Promise(async resolve => {
        const pollingInterval = 1000;
        const poll = setInterval(async function waitForIFrameToLoad() {
            const iFrame = page.frames()
            const count = iFrame.reduce((acc, el) => el.url().includes(url) ? acc + 1 : acc, 0);
            if (count >= num) {
                clearInterval(poll);
                resolve(iFrame);
            }
        }, pollingInterval);
    });
}


export function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}


export function writeFileAsync(path, data, mode) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(path, data, { flag: mode });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function extractConnect(pattern){

    const regex = /Available Connects:\s*(\d+)/; // Matches "Available Connects: " and captures the digits

    const matches = pattern.match(regex);
    if (matches && matches.length > 0) {
      const digits = parseInt(matches[1]); // Extract the captured digits
      return digits;
    }else{
        return 0;
    }
}