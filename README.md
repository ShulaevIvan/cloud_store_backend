### Пример развертывания 

- http://31.31.202.214/

### Инструкция по развертыванию :
    щаблон настроки settingsTODeployVPS.py
    - ALLOWED_HOSTS = ['YOUR IP OR DOMAIN', 'localhost:8000', '127.0.0.1:8000', 'http://YOUR IP OR DOMAIN:8000']
    - SECURE_CROSS_ORIGIN_OPENER_POLICY=TRUE
    - DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'YOUR DATABASE NAME',
            'USER': 'YOUR USERNAME LOGIN TO CONNECT DB',
            'PASSWORD': 'YOUR PASSWORD TO DB',
            'HOST': 'localhost',
            'PORT': '5432',
         }
        }
    - STATIC_URL = '/static/' Папка для создания js/css и пр. на сервере (пример /root/static) Linux
    - MEDIA_URL = '/media/'
    - STATIC_ROOT = join(BASE_DIR, '/static/')
    - STATICFILES_DIRS=[(os.path.join(BASE_DIR,'frontend/build/static/'))] Папка Frontend билда
    - MEDIA_ROOT = join(BASE_DIR, 'media')
    - CORS_ORIGIN_ALLOW_ALL = True (CORS AlLOW)



### Подключение    
##### подключаемся к VPS пример linux:
    - shh root@YOURSERVERIP -u USERNAME -p PASSWORD

linux ubuntu 22.04

### Обновление и установка пакетов:
- sudo apt update
- sudo apt install sudo apt install  python3-pip python3-dev python3-venv libpq-dev postgresql postgresql-contrib nginx supervisor


### Создание DATABASE POSTGRESS

##### вход в коммандный интерфейс psql
- <sudo -u postgres psql>

##### Создание пользователя и полные привилегии
    - CREATE USER test_user WITH PASSWORD 'password'
    - ALTER ROLE test_user SET client_encoding TO 'utf8';
    - ALTER ROLE test_user SET default_transaction_isolation TO 'read committed';
    - ALTER ROLE test_user SET timezone TO 'GMT+3';
    - GRANT ALL PRIVILEGES ON DATABASE db_name TO test_user;

##### выход в терминал
- \q

##### Получение файлов из репозитория
- git clone https://github.com/ShulaevIvan/cloud_store_bakcend.git


### Создаем виртуальное окружение и устанавливаем зависимости
    - python3 -m venv venv
    - source venv/bin/activate
    - python3 -m pip install -r requirements.txt
    - python3 -m pip install uvicorn

### Переходим в папку с проектом
    - python3 manage.py migrate
    - python3 manage.py collectstatic
    - pytohn3 manage.py createsuperuser

### Проверяем uvicorn
    - python -m uvicorn test_wsl.asgi:application --uds /tmp/uvicorn.sock


### Настраиваем supervisor
    - <sudo nano /etc/supervisor/supervisord.conf>

###### в файле supervisor

[program:django]
    command = /home/vmax/venv/bin/python3-m uvicorn test_wsl.asgi:application --uds /tmp/uvicorn.sock
    directory = /home/vmax/django3
    stderr_logfile=/var/log/long.err.log
    stdout_logfile=/var/log/long.out.log
    autostart=true
    autorestart=true

##### Перезапуск supervisor
- service supervisor restart

### Настраиваем nginx
- <sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default-backup>
- <sudo nano /etc/nginx/sites-available/default>

###### в файле default 
##### комментируем / удаляем все,  втавляем код ниже
server {
        listen       80;
        server_name  yourIP OR DOMAIN;
        charset         utf-8;
        client_max_body_size 10M;
  
  location /static {
                alias /home/vmax/django3/static;
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
    <server unix:/tmp/uvicorn.sock;>
}
### Переходим в папку Frontend

### Папка Frontend
- в файле .env указать адрес сервера
- sudo apt install npm установка npm
- npm install установка зависимостей
- npm run build

### сборка
- pytohn3 manage.py collectstatic

### Перезапуск nginx
    - service nginx restart

### Перезапуск supervisor
- service supervisor restart
