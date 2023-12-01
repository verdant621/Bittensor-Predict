import { google } from 'googleapis';
import fs from 'fs'
class GMail {
  constructor(token) {
    const auth = google.auth.fromJSON(token);
    this.gmail = google.gmail({ version: 'v1', auth });
    // this.token = token
  }

  // Reads secrets & tokens from files and authorizes client.
  // authenticate() {
  //   const auth = google.auth.fromJSON(credentials);
  //   return new Promise((resolve, reject) => {
  //     fs.readFile('./credentials/token.json', (err, content) => {
  //       console.log(content)
  //       if (err) reject('Error loading client secret file:', err);
  //       const credentials = JSON.parse(content);
  //       const {client_secret, client_id, redirect_uris} = credentials.installed;
  //       const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  //       fs.readFile('./credentials/token.json', (err, token) => {
  //         if (err) reject('Error loading token file:', err);
  //         oAuth2Client.setCredentials(JSON.parse(token));
  //         resolve(oAuth2Client);
  //       });
  //     });
  //   });
  // };

  // Method to create raw email string
  async searchEmail({subject}){
    const res = await this.gmail.users.messages.list({
      userId: 'me',
      q:`subject: ${subject}`
      
    });
    return res.data;
  }
  async getEmail(id){
    const res = await this.gmail.users.messages.get({
      userId: 'me',
      id: id,
      format: 'full'
    })
    return res.data;
  }
  createEmail(to, from, subject, message) {
    const str = [
      "Content-Type: text/html; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      'to: ', to, '\n',
      'from: ', from, '\n',
      'subject: ', subject, '\n\n',
      message
    ].join('');
    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }

  // Send mail method
  async sendMail({to, from, subject, message}) {
    // const auth = await this.Authenticate();
    const raw = this.createEmail(to, from, subject, message);
    this.gmail.users.messages.send({
      userId: 'me',
      // auth,
      resource: {
        raw
      }
    }, (err, res) => {
      if(err){
        console.log('Error: ', err);
      } else {
        console.log('Result: ');
      }
    });
  }
}

// Usage
// const token = fs.readFileSync('./credentials/token.json')
// const gmail = new GMail(JSON.parse(token.toString()));
// gmail.sendMail({to:'secondworld.dev@gmail.com',from:'receiver@gmail.com', subject:'Test subject', message:'<html><body><div style="color: red;">Hey</div></body></html>'});
export default GMail;