from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import CloudUser

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = CloudUser
        fields = ['id', 'username', 'full_name', 'password', 'email',]
