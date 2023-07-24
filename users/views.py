from django.shortcuts import render, HttpResponse
from .models import CloudUser
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.viewsets  import ModelViewSet
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import CloudUserFiles
from .models import CloudUser

from pprint import pprint
import os


@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def test_token(request):
    return Response('passed {}'.format(request.user.email))



# @api_view(['GET'])
# def users_detail(request):
#     users_data = CloudUser.objects.all()
#     response_arr = []

#     for user in users_data.values():
#         files_size = 0
#         files_count = 0
#         result_obj = {}

#         for file in os.scandir(f'{os.getcwd()}/{user["store_path"]}/'):
#             files_count += 1
#             files_size += os.stat(file).st_size

#         result_obj['id'] = user['id']
#         result_obj['username'] = user['username']
#         result_obj['is_staff'] = user['is_staff']
#         result_obj['email'] = user['email']
#         result_obj['files_count'] = files_count
#         result_obj['files_size'] = files_size

#         response_arr.append(result_obj)
        
#     return Response({'users': response_arr})


