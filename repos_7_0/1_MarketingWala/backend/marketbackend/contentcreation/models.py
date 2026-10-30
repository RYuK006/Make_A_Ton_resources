from django.db import models

# Create your models here.
class scheduleData(models.Model):
    imageUrl = models.URLField(max_length=2083)
    caption=models.TextField()
    campaignScheduling=models.JSONField()
    
    
    def __str__(self):
        return self.caption
    
    
    
class BrandGuidelines(models.Model):
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    colors = models.CharField(max_length=255, blank=True)
    fonts = models.CharField(max_length=255, blank=True)
    key_messages = models.TextField(blank=True)
    tone = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Brand Guidelines - Colors: {self.colors}, Tone: {self.tone}"
    
class NotificationSchedulaData(models.Model):
    campaignScheduling=models.JSONField()
    notification=models.TextField()
    
    
    
    def __str__(self):
        return self.notification
    