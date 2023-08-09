## Fronted repo

https://github.com/ShulaevIvan/cloud_store_frontend


### Настройки SETTINGS.py 

- USERS_STORE_DIR = 'users_store'  - настройка папки хранилища
- SERVER_URL = 'http://localhost:8000'  - настройка папки хранилища
- STATIC_URL = 'static/' - папка статики django + react
- MEDIA_URL = 'media/' - папка медиафайлов
- STATIC_ROOT = join(BASE_DIR, 'static/') главная папка статики
- STATICFILES_DIRS=[(os.path.join(BASE_DIR,'frontend/build/static/'))] путь к билду react
- MEDIA_ROOT = join(BASE_DIR, 'media') - главная папка media

- ADMIN_USER = 'admin' - если не создать superuser вручную создает пользователя с этим логином
- ADMIN_PASSWORD = 'admin2' если не создать superuser вручную добавляет пароль 
- ADMIN_EMAIL = 'testemail22.ru' если не создать superuser вручную добавляет email 

- LOG_FOLDER = 'cloud_store_log' папка где создаются копии логов

## Инструкция по развертыванию приложения:

### ubuntu 22.03

Подключаемся к серверу по ssh.

### Установка необходимых пакетов
```
sudo apt update
```
```
sudo apt install python3-pip python3-dev python3-venv libpq-dev postgresql postgresql-contrib nginx supervisor
```
### Установка/конфигурирование DB postgres
password и db_name можно использовать любой, но тогда нужно не забыть поменять настройки в settings.py.
```
sudo -u postgresql -psql
```
```
CREATE USER cloud with password 'dnweapons1513';
```
```
CREATE DATABASE cloud_base with owner 'cloud';
```
```
ALTER ROLE cloud SET client_encoding to 'utf-8';
```
```
ALTER ROLE cloud SET default_transaction_isolation TO 'read committed';
```
```
ALTER ROLE cloud SET timezone TO 'GMT+3';
```
```
GRANT ALL PRIVILEGES ON DATABASE cloud_base TO cloud;
```
```
 \q
```

### Клонирование репозитория/установка зависимостей/создание виртуального окружения

```
git clone https://github.com/ShulaevIvan/cloud_store_backend.git
```
```
python3 -m venv venv
```
```
source venv/bin/activate
```

```
cd cloud_store_backend
```
```
pip install -r requirements.txt

```
```
python3 -m pip install uvicorn
```

### Создание миграций/superuser

```
python3 manage.py makemigrations
```
```
python3 manage.py migrate
```
```
python3 manage.py collectstatic
```
```
python3 manage.py createsuperuser
```
### проверка работоспособности сокета

```
python3 -m uvicorn cloud_store_backend.asgi:application --uds /tmp/uvicorn.sock
```
CTR + C
### Настройка supervisor

```
sudo nano /etc/supervisor/supervisord.conf
```
#### Вставить этот код в конец файла и сохранить CTR +X

[program:django]
command = /root/venv/bin/python3 -m uvicorn cloud_store_backend.asgi:application --uds /tmp/uvicorn.sock
directory = /root/cloud_store_backend/
stderr_logfile=/var/log/long.err.log
stdout_logfile=/var/log/long.out.log
autostart=true
autorestart=true
CTR+X
YES
sudo service supervisor restart

### Настройка nginx/backup config file

```
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default-backup
```
```
sudo nano /etc/nginx/sites-available/default
```
Удалить/закоментировать все записи, вставить данный код в конец / начало файла и сохранить CTR +X

```
server {
        listen       80;
        server_name  31.31.202.214;
        charset         utf-8;
        client_max_body_size 10M;
  
        location /static {
                alias /root/cloud_store_backend/static;
        }

        location / {
                proxy_set_header Host $http_host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_redirect off;
                proxy_buffering off;
                proxy_pass http://uvicorn;
        }
}
upstream uvicorn {
        server unix:/tmp/uvicorn.sock;
}
```

```
nano /etc/nginx/nginx.conf
```
Заменяем (user www-data) на (user root) и сохраняем CTR +X

### Разворачиваем Frontend

```
cd frontend
```
```
apt install npm
```

```
npm install
```

```
nano env
```
заменяем содержание без закрывающего слеша вконце, устанавливаем ваш ip и сохраняем
REACT_APP_BACKEND_URL='http://Ваш IP'

```
npm run build
```
```
cd 
```

### Настраиваем 

ALLOWED_HOSTS = ['31.31.202.214', 'localhost:8000', '31.31.202.214:8000',]

```
sudo service nginx restart
sudo service supervisor restart
```
