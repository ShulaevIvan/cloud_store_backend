from rest_framework.permissions import BasePermission
from users.models import CloudUser, CloudUserFiles

class IsOwner(BasePermission):

    def has_permission(self, request, view):
        
        print(request.data.get('user'))
        return super().has_permission(request, view)