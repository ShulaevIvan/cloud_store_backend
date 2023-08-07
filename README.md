sudo apt update
sudo apt install python3-pip python3-dev python3-venv libpq-dev postgresql postgresql-contrib nginx supervisor

_____________________________
sudo -u postgresql -psql

CREATE USER cloud with password 'dnweapons1513';
CREATE DATABASE cloud_base with owner 'cloud';
ALTER ROLE cloud SET client_encoding to 'utf-8';
ALTER ROLE cloud SET default_transaction_isolation TO 'read committed';
ALTER ROLE cloud SET timezone TO 'GMT+3';
GRANT ALL PRIVILEGES ON DATABASE cloud_base TO cloud;
\q

________________

git clone https://github.com/ShulaevIvan/cloud_store_backend.git
python3 -m venv venv
source venv/bin/activate
cd cloud_store_backend
pip install -r requirements.txt
python3 -m pip install uvicorn

__________________________

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic
python3 manage.py createsuperuser (name mail password)

_______________________________

python -m uvicorn cloud_store_backend.asgi:application --uds /tmp/uvicorn.sock
CTR + C

sudo nano /etc/supervisor/supervisord.conf

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

______________________________________

sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default-backup
sudo nano /etc/nginx/sites-available/default

server {
        listen       80;
        server_name  31.31.202.214;
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

CTR +X 
YES

nano /etc/nginx/nginx.conf

user root;


cd frontend
apt install npm
YES
npm install
nano .evn
REACT_APP_BACKEND_URL='http://31.31.202.214'
CTR + X
YES
npm run build

cd ..

nano cloud_store_backend/settings.py

ALLOWED_HOSTS = ['31.31.202.214', 'localhost:8000', '31.31.202.214:8000',]
SECURE_CROSS_ORIGIN_OPENER_POLICY=None


service nginx restart
sudo service supervisor restart
