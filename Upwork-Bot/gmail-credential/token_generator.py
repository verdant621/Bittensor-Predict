import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Define the scopes required for accessing Gmail
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']

def generatePickle(credential_path):
    flow = InstalledAppFlow.from_client_secrets_file(credential_path, SCOPES)
    credentials = flow.run_local_server(port=8080)
    # Save the credentials for future use
    with open('token.pickle', 'wb') as token:
        pickle.dump(credentials, token)
        print("Token pickle file created successfully.")

if __name__ == '__main__':
    credential_path = "credential.json"
    generatePickle(credential_path)