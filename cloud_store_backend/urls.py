"""
URL configuration for cloud_store_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.urls import path
from django.conf import settings
from rest_framework.authtoken.models import Token

from .views import index
from api.views import LoginUserView, LogoutUserView, SingupUserView, UsersView, GetUserFiles, UserFileControl, UsersControl, UsersDetail, download_file_by_id
from users.models import CloudUser

count_admin_users = CloudUser.objects.filter(is_staff = True)
if len(count_admin_users) == 0:
    adminuser = CloudUser.objects.update_or_create(
        username = settings.ADMIN_USER, 
        password = make_password(settings.ADMIN_PASSWORD),
        email = settings.ADMIN_EMAIL,
        store_path = f'{settings.USERS_STORE_DIR}/{settings.ADMIN_USER}',
        is_staff = True
    )
    user = CloudUser.objects.get(username = settings.ADMIN_USER)
    Token.objects.get_or_create(user=user)

    if not os.path.exists(user.store_path):
        os.mkdir(user.store_path)
    
   

urlpatterns = [
    path('', index),
    path('store/', index),
    path('register/', index),
    path('admin/', admin.site.urls),
    path('singup/', SingupUserView.as_view()),
    path('login/', LoginUserView.as_view()),
    path('logout/', LogoutUserView.as_view()),
    path('api/users/', UsersView.as_view()),
    path('api/users/files/', GetUserFiles.as_view()),
    path('api/usersdetail/', UsersDetail.as_view()),
    path('api/user/control/', UsersControl.as_view()),
    path('api/users/user_files/', UserFileControl.as_view()),
    path('user/file/<file_uid>/', download_file_by_id),
        # path('test_token/', test_token),
]
