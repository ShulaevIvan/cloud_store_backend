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
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework import routers
from users.views import singup,login, test_token, get_users, UserFilesViewSet, get_file
from .views import index


router = routers.DefaultRouter()
router.register('api/users/user_files', UserFilesViewSet)

urlpatterns = [
    # path('', index),
    # path('manifest.json', TemplateView.as_view(template_name='manifest.json', content_type='application/json'), name='manifest.json'),
    path('admin/', admin.site.urls),
    path('singup/', singup),
    path('login/', login),
    path('api/users/', get_users),
    path('test_token/', test_token),
    path('<file_uid>/', get_file)
] + router.urls
