from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import CloudUser, CloudUserFiles

class CloudUserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = CloudUser
        fields = ['id', 'username', 'full_name', 'password', 'email',]

class CloudUsersSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = CloudUser
        fields = ['id', 'username', 'full_name', 'email', 'is_staff']

class CloudUserFilesSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = CloudUserFiles
        fields = ['id', 'file_name', 'file_type', 'file_url', 'user', 'file_comment']
        # fields = ['id', 'file_name', 'file_type', 'file_data', 'file_url', 'user', 'file_comment']