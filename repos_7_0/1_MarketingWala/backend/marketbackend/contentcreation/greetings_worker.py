from conductor.client.worker.worker_task import worker_task
from oauth2client.service_account import ServiceAccountCredentials
import os

@worker_task(task_definition_name='thebest')
def greetAR() -> str:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construct the path to the JSON credentials file
    creds_path = os.path.join(current_dir, 'marketfcm2-firebase-adminsdk-q4z7u-e91f2f94ef.json')
 # Your credentials dict that you installed above
    scopes  = ['https://www.googleapis.com/auth/firebase.messaging']
    cred_service = ServiceAccountCredentials.from_json_keyfile_dict(creds_path, scopes)
    access_token = cred_service.get_access_token().access_token
    print(access_token)
    return access_token