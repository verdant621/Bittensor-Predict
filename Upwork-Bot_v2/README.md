THE BEST UPWORK BOT
=======

## Prerequisites
> **Install firebase realtime database**
<p align="center">
  <img src="./images/firebase1.png" />
</p>

<p align="center">
  <img src="./images/firebase2.png" />
</p>

Add following rules here.

```json
{
  "rules": {
    ".read": true,
    ".write": true,
    "accounts": {
      ".indexOn": "status"
    },
    "jobs": {
      ".indexOn": "link"
    }
  }
}
```

<p align="center">
  <img src="./images/firebase3.png" />
</p>

Generate new private key and store the content to ./firebase/service-account.json file.
<p align="center">
  <img src="./images/firebase4.png" />
</p>

> **Set template of bid message**

Change prompt in getBidMessage.js file according to your demand. 😁

> **Environment variables**
```bash
HEADLESS=new
PASSWORD=P@ssw0rd123123

# The number of created accounts is maintained as this DEFAULT_ACCOUNT
DEFAULT_ACCOUNT=5
OPENAI_API_KEY=

# generator.email, minuteinbox
TEMP_EMAIL=generator.email

MAIL_SENDER=thomasjones95329@gmail.com
MAIL_RECEIVER=thomasjones95329@gmail.com

# 0 -> search, 1 -> most recent
BID_MODE=0
SEARCH_API="https://www.upwork.com/ab/jobs/search/url?per_page=10&sort=recency&subcategory2_uid=531770282593251331&q="

# If the job is fixed type, it won't bid the jobs that has less amount than this MIN_BUDGET
MIN_BUDGET=300
```

> **Get gmail credential**
Create credential.json file and run the following command to get token.pickle file.

```bash
python token_generator.py
```

Create token.json file for generator.email using the following command.
```bash
python pic2jsonfile.py
```


## Getting Started

> **Create account using your profile**

```bash
node createAccount.js json_filename inf
```

> **Auto bid**
```bash
python start.py
```

> **Message check**
- Generator.email

```bash
node ./message_check/message_check.js sent
node ./message_check/message_check.js active
```

- Minuteinbox

```bash
python ./message_check/message_check.py sent
python ./message_check/message_check.py active
```