from rest_framework.serializers import ModelSerializer
from users.models import CloudUser

class AuthUserSerializer(ModelSerializer):
    pass

class CloudUsersSerializer(ModelSerializer):
    class Meta(object):
        model = CloudUser
        fields = ['id', 'username', 'full_name', 'email', 'is_staff']