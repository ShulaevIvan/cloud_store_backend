from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CloudUser(AbstractUser):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(("email address"), unique=True)
    store_path = models.TextField()
