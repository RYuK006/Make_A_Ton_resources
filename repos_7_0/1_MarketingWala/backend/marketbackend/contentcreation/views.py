import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import scheduleData,NotificationSchedulaData
from .serializers import CampaignSerializer
from .serializers import ScheduleDataSerializer,ScheduleNotificationSerializer
import base64
from io import BytesIO
from PIL import Image
import os
import traceback
import firebase_admin
from firebase_admin import credentials, messaging
import boto3
import requests
from dotenv import load_dotenv
from .fcmmanager import sendPush

load_dotenv()

# Access the variables and store them in settings.py variables
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
API_BASE_URL1 = os.getenv('API_BASE_URL')
AUTH_HEADER = os.getenv('AUTH_HEADER')
FACEBOOK_TOKEN = os.getenv("FACEBOOK_TOKEN")
FCM_TOKEN = os.getenv('FCM_TOKEN')

def decode_base64_image(encoded_image):
    """
    Decodes the base64 image and returns the image binary (or saves it temporarily).
    """
    # Decode the base64 string
    image_data = base64.b64decode(encoded_image.split(',')[1])  # Remove the data URI scheme
    return image_data

def save_image(decoded_image, filename="uploaded_image.png"):
    """
    Save the decoded image to a temporary file.
    """
    with open(filename, "wb") as f:
        f.write(decoded_image)
    return filename

openai.api_key = OPENAI_API_KEY

class CampaignContentGeneratorView(APIView):
    def post(self, request):
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        API_BASE_URL = API_BASE_URL1
        headers = {"Authorization": AUTH_HEADER}
        
        # Extract data from the request
        content_preferences = request.data.get('contentPreferences', {})
        campaign_scheduling = request.data.get('campaignScheduling', {})
        customer_data = request.data.get('customerData', {})
        brand_guidelines = request.data.get('brandGuidelines', {})
        
        # Handling the uploaded image (base64 encoded)
        uploaded_images = content_preferences.get('uploadedImages', [])
        if uploaded_images:
            base64_image = uploaded_images[0]
            decoded_image = base64.b64decode(base64_image.split(",")[1])  # Decode base64 image
            image_filename = "provided_image.jpeg"
            with open(image_filename, "wb") as f:
                f.write(decoded_image)
        else:
            image_filename = "no image provided"

        # Build prompts for Variation 1 and Variation 2
        variation1_prompt = f"""
        Create a captivating image for a marketing campaign with the following content preferences:
        Purpose: {content_preferences.get('purpose', 'general promotion')}.
        Script/Description: {content_preferences.get('scriptDescription', 'standard campaign')}.
        Additional Items: {content_preferences.get('additionalItems', 'props for product enhancement')}.
        In-Post Text: {content_preferences.get('inPostText', 'Buy now for great value!')}.
        Template: {content_preferences.get('template', 'default template')}.
        Post Theme: {content_preferences.get('postTheme', 'product-centric')}.
        Tone: {content_preferences.get('tone', 'playful and engaging')}.
        Content Type: {content_preferences.get('contentType', 'image post')}.
        Target Audience: {content_preferences.get('targetAudience', 'broad audience')}.
        Creative Style: {content_preferences.get('creativeStyle', 'modern and sleek')}.
        Personalization: {', '.join(content_preferences.get('personalization', []))}.

        This campaign should resonate with their interests in {', '.join(customer_data.get('interests', ['general topics']))}. 
        The visuals must comply with the following brand guidelines: 
        - Colors: {brand_guidelines.get('colors', 'standard brand colors')}.
        - Fonts: {brand_guidelines.get('fonts', 'default fonts')}.
        - Key Messages: {brand_guidelines.get('keyMessages', 'emphasizing product quality')}.
        - Tone: {brand_guidelines.get('tone', 'professional yet approachable')}.
        - Logo: {'none' if brand_guidelines.get('logo') is None else 'add logo at the top-right corner'}.

        Ensure the output image has similarities with this: {image_filename}.

        The behavior data spans from {customer_data.get('behaviorDateRange', {}).get('start', 'no start date')} 
        to {customer_data.get('behaviorDateRange', {}).get('end', 'no end date')}, 
        and should be optimized for the following platforms: {', '.join(campaign_scheduling.get('platforms', []))}.
        """

        variation2_prompt = f"""
        Create a captivating image for a marketing campaign with the following content preferences:
        Purpose: {content_preferences.get('purpose', 'special promotion')}.
        Script/Description: {content_preferences.get('scriptDescription', 'targeted campaign')}.
        Additional Items: {content_preferences.get('additionalItems', 'props for product enhancement')}.
        In-Post Text: {content_preferences.get('inPostText', 'Limited time offer!')}.
        Template: {content_preferences.get('template', 'custom template')}.
        Post Theme: {content_preferences.get('postTheme', 'event-specific')}.
        Tone: {content_preferences.get('tone', 'playful and engaging')}.
        Content Type: {content_preferences.get('contentType', 'video post')}.
        Target Audience: {content_preferences.get('targetAudience', 'niche audience')}.
        Creative Style: {content_preferences.get('creativeStyle', 'vibrant and colorful')}.
        Personalization: {', '.join(content_preferences.get('personalization', []))}.

        This campaign should resonate with their interests in {', '.join(customer_data.get('interests', ['specific interests']))}. 
        The visuals must comply with the following brand guidelines: 
        - Colors: {brand_guidelines.get('colors', 'on-brand colors')}.
        - Fonts: {brand_guidelines.get('fonts', 'specific fonts')}.
        - Key Messages: {brand_guidelines.get('keyMessages', 'highlighting limited-time deals')}.
        - Tone: {brand_guidelines.get('tone', 'exciting and vibrant')}.
        - Logo: {'none' if brand_guidelines.get('logo') is None else 'add logo at the top-right corner'}.

        Ensure the output image has similarities with this: {image_filename}.

        The behavior data spans from {customer_data.get('behaviorDateRange', {}).get('start', 'no start date')} 
        to {customer_data.get('behaviorDateRange', {}).get('end', 'no end date')}, 
        and should be optimized for the following platforms: {', '.join(campaign_scheduling.get('platforms', []))}.
        """

        try:
            # Generate images for Variation 1
            response_variation1 = client.images.generate(
                model="dall-e-3",
                prompt=variation1_prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            image_variation1_urls = [image.url for image in response_variation1.data]
            
            # Generate caption for Variation 1 using Cloudflare AI
            def run(model, inputs):
                input = {"messages": inputs}
                response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
                return response.json()

            inputs = [
                {"role": "system", "content": f"directly give a single 2 line caption with hastagswant i only want a single caption and not waste token in any other word .You are a creative marketing team head"},
                {"role": "user", "content": f"{variation1_prompt}"}
            ]
            output = run("@cf/meta/llama-3-8b-instruct", inputs)
            caption_variation1 = output['result']['response']
            
            # caption_variation1_prompt = f"Write an engaging caption for the following: {variation1_prompt}"
            # caption_response1 = client.chat.completions.create(
            #     model="gpt-3.5-turbo",
            #     messages=[
            #         {"role": "system", "content": "directly give a single 2 line caption with hastagswant i only want a single caption and not waste token in any other word .You are a creative marketing team head"},
            #         {"role": "user", "content": caption_variation1_prompt}
            #     ]
            # )
            # caption_variation1 = caption_response1.choices[0].message.content

            # Generate images for Variation 2
            response_variation2 = client.images.generate(
                model="dall-e-3",
                prompt=variation2_prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            image_variation2_urls = [image.url for image in response_variation2.data]

            # Generate caption for Variation 2 using Cloudflare AI
            inputs = [
                {"role": "system", "content": "directly give a single 2 line caption with hastagswant i only want a single caption and not waste token in any other word .You are a creative marketing team head"},
                {"role": "user", "content": f"{variation2_prompt}"}
            ]
            output = run("@cf/meta/llama-3-8b-instruct", inputs)
            caption_variation2 = output['result']['response']
            # caption_variation2_prompt = f"Write an engaging caption for the following: {variation2_prompt}"
            # caption_response2 = client.chat.completions.create(
            #     model="gpt-3.5-turbo",
            #     messages=[
            #         {"role": "system", "content": "directly give a single 2 line caption with hastagswant i only want a single caption and not waste token in any other word .You are a creative marketing team head"},
            #         {"role": "user", "content": caption_variation2_prompt}
            #     ]
            # )
            # caption_variation2 = caption_response2.choices[0].message.content

            # Return the generated content for both variations
            return Response({
                "variation1": {
                    "images": image_variation1_urls,
                    "caption": caption_variation1
                },
                "variation2": {
                    "images": image_variation2_urls,
                    "caption": caption_variation2
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            error_message = str(e)
            full_traceback = traceback.format_exc()  # Capture the full traceback
            print(f"Error: {error_message}\nTraceback: {full_traceback}")
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class SubmitUpdatedCampaignView(APIView):
    
    def post(self, request):
        # Step 1: Download the image from Azure Blob URL
        azure_image_url = request.data.get('imageUrl')  # URL provided in the request data
        try:
            response = requests.get(azure_image_url)
            response.raise_for_status()  # Raise exception if there's an issue
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Failed to download image from Azure: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Process the image with PIL and save it locally as 'AImarket.jpeg'
        local_file_name = 'AImarket.jpeg'
        try:
            image = Image.open(BytesIO(response.content))

            # Convert image to RGB (JPEG doesn't support transparency)
            image.convert('RGB').save(local_file_name, 'JPEG')
        except Exception as e:
            return Response({"error": f"Failed to process image: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 3: Upload the local JPEG image to S3
        s3 = boto3.client('s3',
                          aws_access_key_id=AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                          region_name=AWS_REGION)

        s3_bucket_name = 'marketwala2'
        s3_file_name = 'AImarket.jpeg'  # Fixed file name for S3
        
        
        try:
            # Upload the locally saved file to S3
            with open(local_file_name, 'rb') as f:
                s3.upload_fileobj(f, s3_bucket_name, s3_file_name, ExtraArgs={'ACL': 'public-read'})

            # Generate public URL for the S3 image
            s3_image_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{s3_file_name}"
        except Exception as e:
            return Response({"error": f"Failed to upload image to S3: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        finally:
            # Clean up by deleting the local file
            if os.path.exists(local_file_name):
                os.remove(local_file_name)

        url = "https://graph.facebook.com/v21.0/434878196379802/photos"
        # Parameters for the POST request
        params = {
            "url": f"https://marketwala2.s3.ap-south-1.amazonaws.com/{s3_file_name}",  # URL of the image to be posted
            "caption": f"{request.data.get('caption')}",
            "access_token": FACEBOOK_TOKEN
        }

        # Make the POST request
        response = requests.post(url, params=params)
        # Step 5: Save campaign data to the database
        request.data['imageUrl'] = s3_image_url
        serializer = CampaignSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save S3 URL with the campaign data
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FetchCampaignDataView(APIView):
    def get(self, request):
        try:
            # Get all the scheduleData from the database
            schedule_data = scheduleData.objects.all()
            serializer = ScheduleDataSerializer(schedule_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FetchNotificationDataView(APIView):
    def post(self,request):
        try:
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            content_preferences = request.data.get('contentPreferences', {})
            caption_variation1_prompt =  (
    f"Generate a captivating and engaging push notification message for a social media post. "
    f"Consider the following key attributes to enhance the campaign:\n"
    f"- Post Notification: {content_preferences.get('PostNotification', 'Attention-grabbing alert')}. "
    f"This should quickly capture the user's attention with a clear and strong message.\n"
    f"- Post Theme: {content_preferences.get('postTheme', 'product-focused')}. "
    f"Tailor the message to align with the product-centric theme, ensuring the content highlights key features or benefits.\n"
    f"- Tone: {content_preferences.get('tone', 'playful and engaging')}. "
    f"Make sure the tone is light-hearted, engaging, and encourages interaction from the audience.\n"
    "Create a notification message that is concise, action-oriented, and suitable for social media platforms."
)
            caption_response1 = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a creative social media marketer. add an indian touch to it with hindi and english mix language."},
                    {"role": "user", "content": caption_variation1_prompt}
                ],
                n=4
            )
            messages = [choice.message.content for choice in caption_response1.choices]


                
            return Response({
                "notifications": messages

            }, status=status.HTTP_200_OK)
            
            
        except Exception as e:
            error_message = str(e)
            full_traceback = traceback.format_exc()  # Capture the full traceback
            print(f"Error: {error_message}\nTraceback: {full_traceback}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



# This registration token comes from the client FCM SDKs.
registration_token = FCM_TOKEN

# Function to send a single push notification  
        
class SendNotificationsView(APIView):
    def post(self, request):
        try:
            # Extract notification data from the request body
            notification_data = request.data.get("notification", "")
            
            if notification_data:
                # Debug print the notification data
                print(f"Notification: {notification_data}")
                
                sendPush("hola Amigo!", notification_data, registration_token)
                
                send_conductor_data={
                    "title":"hola Amigo!",
                    "Notification":notification_data
                }
                
                # Send push notification using the extracted data
                serializer = ScheduleNotificationSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()  # Save the validated data to the database
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    print(serializer.errors) 

                return Response({
                    "message": "Notification sent successfully.",
                    "notification": notification_data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "error": "No notification data provided."
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            error_message = str(e)
            full_traceback = traceback.format_exc()  # Capture the full traceback
            print(f"Error: {error_message}\nTraceback: {full_traceback}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class FetchNotification(APIView):

    def get(self,request):
        try:
            # Get all the scheduleData from the database
            schedule_data = NotificationSchedulaData.objects.all()
            serializer = ScheduleNotificationSerializer(schedule_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            error_message = str(e)
            full_traceback = traceback.format_exc()  # Capture the full traceback
            print(f"Error: {error_message}\nTraceback: {full_traceback}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        