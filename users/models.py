from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CloudUser(AbstractUser):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(("email address"), unique=True)
    store_path = models.TextField()

class CloudUserFiles(models.Model):
    file_uid= models.TextField(null=False)
    file_name = models.TextField(null=False)
    file_data = models.TextField(null=False)
    file_type = models.CharField(max_length=128)
    file_url = models.TextField(blank=True)
    file_comment = models.TextField(blank=True)
    file_path = models.TextField(blank=True)
    user = models.ForeignKey(CloudUser, on_delete=models.CASCADE, related_name='userFiles')

