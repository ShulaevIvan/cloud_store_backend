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
from .serializers import CloudUserSerializer, CloudUsersSerializer, CloudUserFilesSerializer
from .models import CloudUserFiles
from .models import CloudUser

from pprint import pprint
import os
import shutil
import base64
import re
import uuid
import datetime


# @api_view(['POST'])
# def login(request):
#     print(request.data)
#     user = get_object_or_404(CloudUser, username=request.data['username'])
#     if not user.check_password(request.data['password']):
#         return Response({'detail': 'Not found.',}, status=status.HTTP_404_NOT_FOUND)
#     token, created = Token.objects.get_or_create(user=user)
#     serializer = CloudUserSerializer(instance=user)
#     if os.path.exists(f'users_store/{user}'):
#         print('test')
#     else:
#         os.mkdir(f'users_store/{user}')
    
#     if user.is_staff:
#         admin_user = CloudUser.objects.get(id = user.id)
#         admin_user.store_path = f'users_store/{user}'
#         admin_user.save()

#     return Response({ 
#         'token': token.key,
#         'user': serializer.data,
#         'is_admin': user.is_staff,
#     })

# @api_view(['POST'])
# def singup(request):
#     serializer = CloudUserSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         user = CloudUser.objects.get(username = request.data['username'])
#         user.set_password(request.data['password'])
#         user.full_name = request.data['full_name']
#         user.store_path = f'users_store/{user}'
#         user.save()
#         token = Token.objects.create(user=user)
#         os.mkdir(user.store_path)

#         return Response({
#             'token': token.key,
#             'user': serializer.data
#         })

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def test_token(request):
    return Response('passed {}'.format(request.user.email))

# @api_view(['GET'])
# def get_users(request):
#     users = CloudUser.objects.all()
#     serializer = CloudUsersSerializer(users, many=True)

#     return Response({'users': serializer.data})


def download_file_by_id(request, file_uid):
    target_file = CloudUserFiles.objects.all().get(file_uid=file_uid)
    file_path = target_file.file_path
    target_file.file_last_download_time = datetime.datetime.now()
    target_file.save()

    with open(file_path, 'rb') as fh:
        response = HttpResponse(fh.read(), content_type=target_file.file_type)
        response['Content-Disposition'] = 'attachment; filename=' + target_file.file_name
        
        return response

# @api_view(['POST'])  
# def get_user_files(request):
#     user_id = request.data['user']
#     current_user_files = CloudUserFiles.objects.all().filter(user=user_id).values()
#     list_result = [entry for entry in current_user_files]

#     return Response(list_result)

# @api_view(['GET','POST', 'DELETE'])
# def create_user_file(request):

#     if request.method == 'DELETE':
#         file_id = request.data['id']
#         user_id = request.data['user']
#         server_file_path = CloudUserFiles.objects.all().filter(file_uid=file_id, user=user_id).values()
#         os.remove(server_file_path[0]['file_path'])
#         CloudUserFiles.objects.get(file_uid = file_id, user = user_id).delete()
#         user_files = CloudUserFiles.objects.all().filter(user=user_id).values()

#         return Response(user_files)

#     elif request.method == 'POST':
#         if request.data.get('rename_id'):
#             user_id = request.data['user']
#             file_id = request.data['rename_id']
#             file_name = request.data['file_name']
#             file_comment = request.data['file_comment']
#             user = CloudUser.objects.all().get(id=user_id)
#             target_file = CloudUserFiles.objects.get(user=user_id, file_uid = file_id)
#             old_file_path = target_file.file_path
            
#             file_type = re.findall(r'\.(\w+|\d+)$', target_file.file_path)[0]
#             target_file.file_name = file_name
#             target_file.file_comment = file_comment
#             target_file.save()

#             new_file_path = f'{user.store_path}/{target_file.file_name}{target_file.file_uid}.{file_type}'
#             new_file = CloudUserFiles.objects.get(user=user_id, file_uid = file_id)
#             new_file.file_path = new_file_path
#             new_file.save()
#             response = CloudUserFiles.objects.all().filter(file_uid = file_id, user=user_id).values()[0]

#             os.rename(old_file_path, new_file_path)
#             return Response(response)
#         else:
#             user_id = request.data['user']
#             file_name = re.sub(r'\.(\w+|\d+)$', '', request.data['file_name'])
#             file_data = request.data['file_data']
#             file_type = re.findall(r'\.(\w+|\d+)$', request.data['file_name'])[0]
#             file_id = uuid.uuid4()
#             user = CloudUser.objects.all().get(id=user_id)

#             if file_id != '':
#                 CloudUserFiles.objects.create(
#                     file_uid = file_id,
#                     file_name = f'{file_name}.{file_type}',
#                     file_type = request.data['file_type'],
#                     file_url = f'http://127.0.0.1:8000/user/file/{file_id}/',
#                     file_comment = request.data['file_comment'],
#                     file_path = f'{user.store_path}/{file_name}{file_id}.{file_type}',
#                     user = CloudUser(id=request.data['user']),
#                 ).save()

#                 with open(f'{user.store_path}/{file_name}{file_id}.{file_type}', "wb") as file:
#                     file.write(base64.b64decode(file_data))
#                 data = CloudUserFiles.objects.all().filter(user=user_id, file_uid = file_id).values()[0]
#                 return Response(data)
        
#     elif request.method == 'GET':
#         file_id = request.GET.get('id')
#         file_obj = CloudUserFiles.objects.all().filter(file_uid=file_id).values()
#         if file_obj[0]:
#             return Response(file_obj[0])

@api_view(['GET'])
def users_detail(request):
    users_data = CloudUser.objects.all()
    response_arr = []

    for user in users_data.values():
        files_size = 0
        files_count = 0
        result_obj = {}

        for file in os.scandir(f'{os.getcwd()}/{user["store_path"]}/'):
            files_count += 1
            files_size += os.stat(file).st_size

        result_obj['id'] = user['id']
        result_obj['username'] = user['username']
        result_obj['is_staff'] = user['is_staff']
        result_obj['email'] = user['email']
        result_obj['files_count'] = files_count
        result_obj['files_size'] = files_size

        response_arr.append(result_obj)
        
    return Response({'users': response_arr})

@api_view(['POST'])
def user_control(request):
    action = request.data.get('action')
    
    if request.method == 'POST' and action == 'DELETE':
        target_user_id = request.data.get('target_user')
        user_object = CloudUser.objects.get(id=target_user_id)
        remove_username = user_object.username
        user_object.delete()
        
        shutil.rmtree(f'{os.getcwd()}/{user_object.store_path}/')
        return Response({'status': 'ok', 'username': remove_username, 'user_id': target_user_id})
    
    if request.method == 'POST' and action == 'TOADMIN':
        target_user_id = request.data.get('target_user')
        user_object = CloudUser.objects.get(id = target_user_id)
        user_object.is_staff = True
        user_object.save()

        return Response({'status': 'ok'})
    
    if request.method == 'POST' and action == 'TOUSER':
        target_user_id = request.data.get('target_user')
        user_object = CloudUser.objects.get(id = target_user_id)
        user_object.is_staff = False
        user_object.save()

        return Response({'status': 'ok'})

