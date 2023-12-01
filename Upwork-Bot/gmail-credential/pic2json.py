import json
import pickle
from google.oauth2.credentials import Credentials

def extract_credentials(obj):
    if isinstance(obj, Credentials):
        return {
            'token': obj.token,
            'refresh_token': obj.refresh_token,
            'id_token': obj.id_token,
            'token_uri': obj.token_uri,
            'client_id': obj.client_id,
            'client_secret': obj.client_secret,
            'scopes': obj.scopes
        }
    return vars(obj)

# Load data from the pickle file
with open('token.pickle', 'rb') as pik:
    pik_data = pickle.load(pik)

# Write the data to a JSON file
with open('token.json', 'w') as jsn:
    json.dump(pik_data, jsn, default=extract_credentials)