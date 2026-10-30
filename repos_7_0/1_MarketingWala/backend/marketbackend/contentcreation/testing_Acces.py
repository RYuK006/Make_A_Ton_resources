from conductor.client.worker.worker_task import worker_task
import requests
from dotenv import load_dotenv
import os

load_dotenv()

FCM_TOKEN = os.getenv('FCM_TOKEN')

@worker_task(task_definition_name='test_fcm_endpoint1ans')
def test_access22() -> str:
    load_dotenv()

    FCM_TOKEN = os.getenv('FCM_TOKEN')
    access_token = FCM_TOKEN
    url = 'https://fcm.googleapis.com/v1/projects/marketfcm2/messages:send'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        "message": {
            "token": "ehpsqpATS-OwHdCToPkffh:APA91bF_IgAv-x2LgfFRbDkIXvFflCFeVsm5arY90KSvBBYyc6gchS98klTCNGjgzyo6UBEtFdDR1b76hKs8Qj3i-JRlNyFdA51IeZABpWRoDRsAI2aJnc0EIEgcBhJ8SozU3weWi_73",
            "notification": {
                "body": "This is an FCM notification message! for testing form",
                "title": "FCM Message"
            },
            "android": {
                "priority": "high"
            }
        }
    }

    response = requests.post(url, headers=headers, json=data)
    return response.status_code
