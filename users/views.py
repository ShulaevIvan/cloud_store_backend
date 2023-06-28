from django.shortcuts import render
from django.contrib.auth.models import User
from .models import CloudUser
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView


from .serializers import UserSerializer



@api_view(['POST'])
def login(request):
    user = get_object_or_404(CloudUser, username=request.data['username'])
    print(user.store_path)
    if not user.check_password(request.data['password']):
        return Response({'detail': 'Not found.',}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({ 
        'token': token.key,
        'user': serializer.data
    })

@api_view(['POST'])
def singup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = CloudUser.objects.get(username = request.data['username'])
        user.set_password(request.data['password'])
        user.full_name = request.data['full_name']
        user.store_path = f'store/{request.data["username"]}'
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

