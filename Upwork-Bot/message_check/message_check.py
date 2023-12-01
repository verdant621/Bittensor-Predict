from pyminuteinbox import TempMailInbox, TempMail
import time
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from email.mime.text import MIMEText
import base64
import os
import pickle
from dotenv import load_dotenv
import firebase_admin
import sys
from firebase_admin import credentials
from firebase_admin import db

# put the path to your .env file here
dotenv_path = '../.env'

# load the .env file
load_dotenv(dotenv_path)

service_account = {
  "type": "service_account",
  "project_id": "upwork-132f8",
  "private_key_id": "e340e278a0a0c5f93dee91b800d45df1f0a9e189",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD74jSORt9L0+mP\nhQ1id7Mj9m3FmnRUHF5gvAn3ebVIiboNfJ/P6GVnvixw0ZhESL+pMOxdRxhGgTkL\nq6OjS31whNP64VSGC4WrTODzUKJwCnpdmty3eeTqwwiXQX7d98LCFICCj53+L2pm\nU1qyKYxZe8qbiadtpqCTIZdzVniNRZ/j/YEjpcT/fssgviJdxW+rmt7jVW0CoaUY\nsvqVK8uP7t6a9b2iB2tlWna6ygiQsZnIj8r2XBBOqkT1Dpx2wHSGEaso7XiLzThA\nRs6PMgMF7O0to3qAdhpP/7oMli6GSPI0oh4rqiBZa+Vs34ucFRcc6RmX+Ax+Jzns\nt7Y0Gx7BAgMBAAECggEACEbhlPt0zDjgu9siioCA3Jmft7lIoWMZbKqVKxfe360L\nQJ+edUOk1xI/gy63UbwbFIf+O7OcaLmyP7p3xbkzRv1NusNeMTWY99JuhxRN3X+8\npQ2JEJw4QV4gDsSuUsSDgU2Q6lQQ5s4U/Bs5Alx9kgsF3aikna9BZ3WjFJ1MGBFC\nUdeZPRwJ9PjmLekA5fcrnw+auMkOBYGC7Ov+EoRH7TWFc25VTiNOm2sXupSNXvwg\nuPepO2SdURzsj9wmAFnAxsy7x2ayYGJMAau1A29aevaWSBCrRhvjx86xXpgvnGm7\nRTLz6Qi4lhVR8mB8op4DVWvpAxicv7seaDdwk3PfiQKBgQD+Loie70fkyt2x68Sv\nMiqBYAvM/cUUaglNki2A23GVQAU3fIO9P+mcM3u7ToPrKCdE40hXyU1TaLwBIZzY\nhJYnYvSaRH5j0JE2XdvLyWP3dyeyQLI4sNL1jowwc+b9aOK40oaMmbKgdlRXKuXY\n5cuO1bczO9G/7ABpYBDce8RAGQKBgQD9r3aRZSLr2VTWcTeBSlDoGJq9jIi05PzM\nbRZQbjmm2jBpz3bhxY5WyIs16/r+CTz+jBFxTBygSrZPGuMsO7K6jepmxxClrwEj\nXb08H1PsEWem+UqXFb+d+9EPcvH29XdrVVoMdSs4XjeIvwxvJQVAArHNHkkjPwUc\nwd2179wI6QKBgBo/0/wV2ebWzG5DWtx84cbalF1nF6M0ECHiprBX+TLgmalRQomY\nwBdRecWuJhFy5BtJHX9zWnjyp/e18OyrRJZssbX8vNCyCU0EBF7XPWug8oiGBeG0\n4RRa1D9suL4SxtcvZpW+iaPolG0sEPCFSrBFgdXYp6CaTrCTKyqZ3XqBAoGBANR1\n6kBUyo1qA/Jg+ZJvkhj/2kDbfPa7PLlcty5/UgtaeudzGGZ3lQE7jdOIIjo1tH6f\nAlC35NWeHNdddlrqWIKDLogLOfb4/WQIMt8ygY+Y+A1QhVbJoSSH7IwawWkKJYyf\n+/2o95yK08nT7276O05js1NNhQVe10JBXxTroIVZAoGBALxm0UP3VE3d50BWDDlR\ni+73fd/Tkk0U6SPgO5xNm7hGNLOyOGQjv56Zp5NtyhIpN0sPU0WAYQ227miJElwA\nWlif59b9lXadPA+hcsgJlfbAzutlXz6EoQYk0+6akT/oPk/cMvdY93c8gf6DN3Xx\nafGy91qEAwCojyiWjLzRpaX2\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-ossbi@upwork-132f8.iam.gserviceaccount.com",
  "client_id": "117687275061951542512",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ossbi%40upwork-132f8.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

cred = credentials.Certificate(service_account)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://upwork-132f8-default-rtdb.firebaseio.com'
    
})

accountRef = db.reference('/accounts')


def service_account_login():
    """Shows basic usage of the Gmail API.
    Lists the user's Gmail labels.
    """
    creds = None
    if os.path.exists('gmail-credential/token.pickle'):
        with open('gmail-credential/token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'gmail-credential/credential.json', ['https://www.googleapis.com/auth/cloud-platform'])
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('gmail-credential/token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    try:
        service = build('gmail', 'v1', credentials=creds)
        return service
    except Exception as e:
        print('An error occurred: %s' % e)


def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw_message = base64.urlsafe_b64encode(message.as_bytes())
    raw_message = raw_message.decode()
    return {'raw': raw_message}


def send_message(service, user_id, message):
    try:
        message = service.users().messages().send(
            userId=user_id, body=message).execute()
        print('Message Id: %s' % message['id'])
        return message
    except Exception as e:
        print('An error occurred: %s' % e)


while True:
    print("=========== START CHECKING ===========")
    data = accountRef.order_by_child('status').equal_to(sys.argv[1]).get()
    keys = list(data.keys())
    print(len(keys))
    for index, key in enumerate(keys):
        try:
            if data[key]['type'] == 'generator.email':
                continue
            mail = data[key]['email']
            token = data[key]['token']

            print("      " + str(index + 1) + "\t\t" + mail)

            try:
                msgs = 0
                if 'received' in data[key]:
                    msgs = data[key]['received']

                messages = []

                inbox = TempMailInbox(address=mail, access_token=token)
                received_mails = inbox.get_all_mails()

                if (len(received_mails) > msgs):
                    new_mails = received_mails

                    flag = False
                    verifyNum = 0

                    for mail_item in new_mails:
                        messages.append(mail_item.subject)
                        if mail_item.subject.count('Welcome to Upwork') > 0 or mail_item.subject.count('Verify your email address') > 0 or mail_item.subject.count('Welcome to MinuteInbox') > 0 or mail_item.subject.count('Welcome to FakeMail') > 0 or mail_item.subject.count("Let’s keep your momentum going") > 0:
                            continue
                        elif mail_item.subject.count('Action required') > 0:
                            verifyNum += 1
                            if (verifyNum > 1):
                                flag = True
                            continue
                        sender = 'ANTI-UPWORK'
                        to = os.getenv("MAIL_RECEIVER")
                        subject = mail_item.subject
                        message_text = mail
                        service = service_account_login()
                        msg = create_message(sender, to, subject, message_text)
                        if (sys.argv[1] == 'sent'):
                            send_message(service, 'me', msg)

                    ref = db.reference('/accounts/' + key)
                    if flag:
                        ref.update({
                            'status': 'delete',
                            'received': len(received_mails),
                            'messages': messages
                        })
                        print("      DELETED-0: " + mail + "\n")
                    else:
                        ref.update({
                            'received': len(received_mails),
                            'messages': messages
                        })
            except Exception as e:
                if (str(e).count('Expecting value: line 1 column 1 (char 0)') > 0):
                    ref = db.reference('/accounts/' + key)
                    ref.delete()
                    print("      DELETED-1: " + mail + "\n")
                else:
                    print(str(e))
        except Exception as e:
            pass
    print("=========== END   CHECKING ===========")
    time.sleep(1)
