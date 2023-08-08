import os
from django.conf import settings


if not os.path.exists(settings.USERS_STORE_DIR):
    os.mkdir(settings.mkdir(settings.USERS_STORE_DIR))
else:
    print(f'users folder: {os.getcwd()}/{settings.USERS_STORE_DIR}')



