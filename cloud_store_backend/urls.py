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
from django.contrib import admin
from django.urls import path
from users.views import test_token
from .views import index
from api.views import LoginUserView, LogoutUserView, SingupUserView, UsersView, GetUserFiles, UserFileControl, UsersControl, UsersDetail, download_file_by_id


urlpatterns = [
    path('admin/', admin.site.urls),
    path('singup/', SingupUserView.as_view()),
    path('login/', LoginUserView.as_view()),
    path('logout/', LogoutUserView.as_view()),
    path('api/users/', UsersView.as_view()),
    path('api/users/files/', GetUserFiles.as_view()),
    path('api/usersdetail/', UsersDetail.as_view()),
    path('api/user/control/', UsersControl.as_view()),
    path('api/users/user_files/', UserFileControl.as_view()),
    path('test_token/', test_token),
    path('user/file/<file_uid>/', download_file_by_id),
]
