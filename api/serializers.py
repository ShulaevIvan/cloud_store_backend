from rest_framework import serializers
from rest_framework.serializers import ValidationError
from users.models import CloudUser, CloudUserFiles

import re

class AuthUserSerializer(serializers.ModelSerializer):
    pass

class CloudUsersSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length = 255)
    class Meta(object):
        model = CloudUser
        fields = ['id', 'username', 'full_name', 'email', 'is_staff']

class SingUpLoginSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = CloudUser
        fields = ['id', 'username', 'full_name', 'password', 'email',]

    def validate_username(self, value):
        first_sym = re.compile(value[0])
        other_sym = re.compile('[a-zA-Z0-9_]')
        if len(value) >=4 and len(value) < 20 and first_sym.match(value) and other_sym.match(value):
            return super().validate(value)
        raise ValidationError('username validation err')
    
    def validate_password(self, value):
        pattern = re.compile('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{4,20}$')
        if pattern.match(value):
            return super().validate(value)
        raise ValidationError('password validation err')
    
    def validate_email(self, value):
        pattern = re.compile('\"?([-a-zA-Z0-9.`?{}]+@\w+\.\w+)\"?')
        if pattern.match(value):
            return super().validate(value)
        raise ValidationError('email validation err')
    

class UserFileControlSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CloudUserFiles
        fields = ['file_type', 'file_name',  'user']
