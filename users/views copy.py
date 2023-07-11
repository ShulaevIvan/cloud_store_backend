from django.shortcuts import render
from .models import CloudUser
from django.shortcuts import get_object_or_404
import os
import base64
import re
import uuid

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.viewsets  import ModelViewSet
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import CloudUserSerializer, CloudUsersSerializer, CloudUserFilesSerializer
from .models import CloudUserFiles
from .models import CloudUser



@api_view(['POST'])
def login(request):
    user = get_object_or_404(CloudUser, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'detail': 'Not found.',}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = CloudUserSerializer(instance=user)
    if os.path.exists(f'{os.getcwd()}/users_store/{user}'):
        print('test')
    else:
        os.mkdir(f'{os.getcwd()}/users_store/{user}')

    return Response({ 
        'token': token.key,
        'user': serializer.data
    })

@api_view(['POST'])
def singup(request):
    serializer = CloudUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = CloudUser.objects.get(username = request.data['username'])
        user.set_password(request.data['password'])
        user.full_name = request.data['full_name']
        user.save()
        token = Token.objects.create(user=user)

        return Response({
            'token': token.key,
            'user': serializer.data
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def test_token(request):
    return Response('passed {}'.format(request.user.email))

@api_view(['GET'])
def get_users(request):
    users = CloudUser.objects.all()
    serializer = CloudUsersSerializer(users, many=True)
    return Response({'users': serializer.data})


class UserFilesViewSet(ModelViewSet):
    queryset = CloudUserFiles.objects.all()
    serializer_class = CloudUserFilesSerializer
    filterset_fields = ['user']

    def create(self, request, *args, **kwargs):
        file_name = request.data['file_name']
        file_data = re.sub(r"</?\[\d+>", "", request.data['file_data'])
        file_type = re.findall(r'\.(\w+|\d+)$', request.data['file_name'])[0]
        if (len(file_data) % 4) > 0:
            file_data += "=" * ((4 - len(file_data) % 4) % 4)

        with open(f'{file_name}{uuid.uuid4()}.{file_type}', "wb") as file:
            file.write(base64.b64decode(file_data))
        return super().create(request, *args, **kwargs)


    # def delete(self, request):
    #     user = request.data['user']
    #     file_id = request.data['id']
    #     print(request)
    #     CloudUserFiles.objects.filter(id=file_id).delete()
        
    #     return Response(status=status.HTTP_204_NO_CONTENT)
