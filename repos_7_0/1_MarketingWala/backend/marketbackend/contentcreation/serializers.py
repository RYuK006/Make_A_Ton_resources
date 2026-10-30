from rest_framework import serializers
from .models import scheduleData
from .models import NotificationSchedulaData

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = scheduleData
        fields = ['campaignScheduling','caption','imageUrl' ]

class ScheduleDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = scheduleData
        fields = ['id', 'imageUrl', 'caption']
        
class ScheduleNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model= NotificationSchedulaData
        fields = ['notification','campaignScheduling']

