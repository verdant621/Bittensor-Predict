import dotenv from 'dotenv';
import fs from 'fs';
import { google } from 'googleapis';
import { getAccounts, updateAccount } from '../firebase/firebase.js';
import { getMessages } from '../mailbox.js';
import { wait } from '../utils.js';

dotenv.config();

const TOKEN_PATH = './gmail-credential/token.json';
const CREDENTIAL_PATH = './gmail-credential/credential.json';

const getAuth = () => {
    const content = fs.readFileSync(CREDENTIAL_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
}

function sendMessage(subject, msg) {
    const body = `${msg}`
    const auth = getAuth();
    const gmail = google.gmail({ version: 'v1', auth });
    let email_lines = [];
    email_lines.push(`From: "ANTI-UPWORK" <${process.env.MAIL_SENDER}>`);
    email_lines.push(`To: ${process.env.MAIL_RECEIVER}`);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push(`Subject: ${subject}`);
    email_lines.push('');
    email_lines.push(body);
    let email = email_lines.join('\r\n').trim();

    let base64EncodedEmail = Buffer.from(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': base64EncodedEmail
        }
    }, (err, result) => {
        if (err) {
            console.log('NODEMAILER - The API returned an error: ' + err);
            return;
        }
    });
}

async function checkEmails(status) {
    const accounts = await getAccounts(status);

    console.log("=========== START CHECKING ===========");
    console.log(accounts.length);

    for (const account of accounts) {
        if (account.data['type'] !== 'generator.email') continue;
        console.log("        ", account.data.email);
        const messages = await getMessages(account.data.email);

        let msgs = 0;
        if (account.data['received']) msgs = account.data['received'];

        let flag = false;

        let verifyNum = 0;

        if (msgs >= messages.length) continue;

        for (const message of messages.slice(0, messages.length - msgs)) {
            if (message.indexOf('Verify your email address') > -1 || message.indexOf('Let’s keep your momentum going') > -1 || message.indexOf('Welcome to Upwork') > -1) continue;
            else if (message.indexOf('Action required') > -1) {
                verifyNum += 1;
                if (verifyNum > 1) flag = true;

                continue;
            }

            if (status === 'sent') sendMessage(message, account.data.email);
        }

        if (flag) {
            await updateAccount(account.id, {
                status: 'delete',
                received: messages.length,
                messages
            });

            console.log("      DELETED-0: ", account.data.email)
        } else {
            await updateAccount(account.id, {
                received: messages.length,
                messages
            })
        }
    }
}

while (true) {
    await checkEmails(process.argv[2]);
    await wait(1000);
}