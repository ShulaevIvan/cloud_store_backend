import os
import shutil
import base64
import re
import uuid
import datetime
import logging

from django.conf import settings
from django.shortcuts import get_object_or_404,HttpResponse
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny,IsAdminUser
from rest_framework.authentication import TokenAuthentication

from users.models import CloudUser, CloudUserFiles
from .serializers import CloudUsersSerializer, SingUpLoginSerializer, UserFileControlSerializer



logger = logging.getLogger(__name__)

class LoginUserView(APIView):
    permission_classes = [AllowAny,]
    def post(self, request):
        
        try:
            user = get_object_or_404(CloudUser, username=request.data['username'])
            if not user.check_password(request.data['password']):
                return Response({'detail': 'Not found',}, status=status.HTTP_404_NOT_FOUND)
        
            token, created = Token.objects.get_or_create(user=user)
            serializer = SingUpLoginSerializer(instance=user)

            if os.path.exists(f'{settings.USERS_STORE_DIR}/{user}'):
                pass
            else:
                os.mkdir(f'{settings.USERS_STORE_DIR}/{user}')
    
            if user.is_staff:
                admin_user = CloudUser.objects.get(id = user.id)
                admin_user.store_path = f'{settings.USERS_STORE_DIR}/{user}'
                authenticate(username=admin_user.username, password=admin_user.password)
                admin_user.save()
            
            authenticate(username = user.username, password = user.password)

            return Response({ 
                'status': status.HTTP_202_ACCEPTED,
                'token': token.key,
                'user': serializer.data,
                'is_admin': user.is_staff,
                'auth': True,
            })
        except:
            return Response({'status': 'login failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class LogoutUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            target_user_id = request.data['user']
            try:
                Token.objects.get(user=target_user_id).delete()
            except:
                return Response({'status': 'user is offline'}, status=status.HTTP_200_OK)
        
            return Response({'status':'ok'}, status=status.HTTP_200_OK)
        except:
            return Response({'status': 'logout err'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class SingupUserView(APIView):
    permission_classes = [AllowAny,]

    def post(self, request):
        try:
            serializer = SingUpLoginSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                user = CloudUser.objects.get(username = request.data['username'])
                user.set_password(request.data['password'])
                user.full_name = request.data['full_name']
                user.store_path = f'{settings.USERS_STORE_DIR}/{user}'
                user.save()
                os.mkdir(user.store_path)

                return Response({
                    'user': serializer.data,
                    'is_staff': user.is_staff,
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class UsersView(APIView):
    authentication_classes = [TokenAuthentication,]
    permission_classes = [IsAuthenticated, IsAdminUser,]

    def get(self, request):
        try:
            users = CloudUser.objects.all()
            serializer = CloudUsersSerializer(users, many=True)

            return Response({'users': serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response({'users': 'cannot get users err'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class GetUserFiles(APIView):
    authentication_classes = [TokenAuthentication,]
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        try:
            user = CloudUser.objects.get(id=request.data['user'])

            if user.is_authenticated and user.id == request.data['user'] or user.is_staff:
                current_user_files = CloudUserFiles.objects.all().filter(user=user.id).values()
                list_result = [item for item in current_user_files]

                return Response(list_result, status=status.HTTP_200_OK)
        
            return Response({'status': 'not found'}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'status': 'cannot get files'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserFileControl(APIView):
    authentication_classes = [TokenAuthentication,]
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        try:
            download = request.GET.get('download')
            file_id = request.GET.get('id')
            file_obj = CloudUserFiles.objects.all().filter(file_uid=file_id).values()
            user_check = CloudUser.objects.get(id=file_obj[0]['user_id'])
            
            if download:
                file = CloudUserFiles.objects.get(file_uid=file_id, user=file_obj[0]['user_id'])
                file.file_last_download_time = datetime.datetime.utcnow()
                file.save()

            if file_obj[0] and user_check.is_authenticated or file_obj[0] and user_check.is_staff:
                return Response(file_obj[0], status=status.HTTP_200_OK)
        
            return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'status': 'err'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        try:
            serializer = UserFileControlSerializer(data=request.data)
      
            if request.data.get('rename_id') and request.data.get('user') and request.data.get('file_name'):
                user_id = request.data['user']
                file_id = request.data['rename_id']
                file_name = request.data['file_name']
                file_comment = request.data['file_comment']
                user = CloudUser.objects.all().get(id=user_id)
                target_file = CloudUserFiles.objects.get(user=user_id, file_uid = file_id)
                old_file_path = target_file.file_path
                file_type = re.findall(r'\.(\w+|\d+)$', target_file.file_path)[0]
                target_file.file_name = file_name
                target_file.file_comment = file_comment
                target_file.save()

                new_file_path = f'{user.store_path}/{target_file.file_name}{target_file.file_uid}.{file_type}'
                new_file = CloudUserFiles.objects.get(user=user_id, file_uid=file_id)
                new_file.file_path = new_file_path
                new_file.save()
                response = CloudUserFiles.objects.all().filter(file_uid = file_id, user=user_id).values()[0]

                os.rename(old_file_path, new_file_path)

                return Response(response, status=status.HTTP_201_CREATED)

            elif serializer.is_valid():
                user_id = request.data['user']
                file_name = re.sub(r'\.(\w+|\d+)$', '', request.data['file_name'])
                file_data = request.data['file_data']
                file_type = re.findall(r'\.(\w+|\d+)$', request.data['file_name'])[0]
                file_id = uuid.uuid4()
                user = CloudUser.objects.all().get(id=user_id)

                if file_id != '':
                    CloudUserFiles.objects.create(
                        file_uid = file_id,
                        file_name = f'{file_name}.{file_type}',
                        file_type = request.data['file_type'],
                        file_url = f'{settings.SERVER_URL}/user/file/{file_id}/',
                        file_comment = request.data['file_comment'],
                        user = CloudUser(id=request.data['user']),
                        file_path = f'{user.store_path}/{file_name}{file_id}.{file_type}',
                    ).save()

                    with open(f'{user.store_path}/{file_name}{file_id}.{file_type}', "wb") as file:
                        file.write(base64.b64decode(file_data))
                    data = CloudUserFiles.objects.all().filter(user=user_id, file_uid = file_id).values()[0]

                    return Response(data, status=status.HTTP_201_CREATED)
                
            return Response({'status': 'not found'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'status': 'err'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request):
        try:
            file_id = request.data['id']
            user_id = request.data['user']
            server_file_path = CloudUserFiles.objects.all().filter(file_uid=file_id, user=user_id).values()
            os.remove(server_file_path[0]['file_path'])
            CloudUserFiles.objects.get(file_uid = file_id, user = user_id).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'status': 'not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class UsersControl(APIView):
    authentication_classes = [TokenAuthentication,]
    permission_classes = [IsAdminUser,]

    def post(self, request):
        try:
            action = request.data.get('action')
    
            if request.method == 'POST' and action == 'TOADMIN':
                target_user_id = request.data.get('target_user')
                user_object = CloudUser.objects.get(id = target_user_id)
                user_object.is_staff = True
                user_object.save()

                return Response({'status': 'ok'}, status=status.HTTP_202_ACCEPTED)
    
            if request.method == 'POST' and action == 'TOUSER':
                target_user_id = request.data.get('target_user')
                user_object = CloudUser.objects.get(id = target_user_id)
                user_object.is_staff = False
                user_object.save()

                return Response({'status': 'ok'}, status=status.HTTP_202_ACCEPTED)
        
            if request.method == 'POST' and action == 'LOGOUT':
                target_user_id = request.data.get('target_user')
                token  = Token.objects.get(user=target_user_id).delete()


                return Response({'status': 'ok'}, status=status.HTTP_202_ACCEPTED)
        
            return Response({'status': 'err'}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'status': 'err'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self, request):
        action = request.data.get('action')
        
        if request.method == 'DELETE' and action == 'DELETE':
                target_user_id = request.data.get('target_user')
                user_object = CloudUser.objects.get(id=target_user_id)
                remove_username = user_object.username
                user_object.delete()
        
                shutil.rmtree(f'{os.getcwd()}/{user_object.store_path}/')

                return Response({'status': 'ok', 'username': remove_username, 'user_id': target_user_id}, status=status.HTTP_204_NO_CONTENT)
    
class UsersDetail(APIView):
    authentication_classes = [TokenAuthentication,]
    permission_classes = [IsAdminUser,]

    def get(self, request):
        try:
            users_data = CloudUser.objects.all()
            response_arr = []
            if users_data:
                for user in users_data.values():
                    files_size = 0
                    files_count = 0
                    result_obj = {}
                    tokenQuery = Token.objects.all().filter(user=user['id']).values()

                    for file in os.scandir(f'{os.getcwd()}/{user["store_path"]}/'):
                        files_count += 1
                        files_size += os.stat(file).st_size

                    result_obj['id'] = user['id']
                    result_obj['username'] = user['username']
                    result_obj['is_staff'] = user['is_staff']
                    result_obj['email'] = user['email']
                    result_obj['files_count'] = files_count
                    result_obj['files_size'] = files_size
                    if tokenQuery.first() is None:
                        result_obj['auth'] = True
                    result_obj['auth'] = False

                    response_arr.append(result_obj)
        
                return Response({'users': response_arr}, status=status.HTTP_200_OK)
        
            return Response({'status': 'not found'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'status': 'err'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def download_file_by_id(request, file_uid):
    try:
        target_file = CloudUserFiles.objects.all().get(file_uid=file_uid)
        file_path = target_file.file_path
        # target_file.file_last_download_time = datetime.datetime.now()
        # target_file.save()

        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type=target_file.file_type)
            response['Content-Disposition'] = 'attachment; filename=' + target_file.file_name
        
            return response
    except:
        return  Response({'status': 'err'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def test_token(request):
#     return Response('passed {}'.format(request.user.email))