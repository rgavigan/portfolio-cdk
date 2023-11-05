#!/bin/bash

# Downloads All Required Packages for Chess Application
echo "Update and install required packages (-y to skip prompts)"
yum update -y
yum install -y git gcc gcc-c++ boost boost-devel cmake doxygen libpq libpq-devel nginx fcgi libGLEW sqlite sqlite-devel

# Downloads Wt From GitHub
echo "Download Wt"
cd /home/ec2-user/
wget https://github.com/emweb/wt/archive/4.10.1.tar.gz
tar xvf 4.10.1.tar.gz
cd wt-4.10.1
mkdir build
cd build
cmake ..

# Makes Wt
echo "Make Wt"
make -j4

# Installs Wt
echo "Install Wt"
make install
ldconfig

# Sets EC2 User Library Paths
echo "Set Library Path for EC2 User"
echo 'export LD_LIBRARY_PATH=/usr/local/lib' >> /home/ec2-user/.bashrc
echo 'export WT_BASE=/usr/local' >> /home/ec2-user/.bashrc
source /home/ec2-user/.bashrc

# Clones Chess Repository
echo "Clone the git repository"
git clone https://github.com/rgavigan/chess.git /home/ec2-user/chess

# Builds Chess Application
echo "Build the application"
make -C /home/ec2-user/chess

# Install Certbot
echo "Install Certbot"
sudo dnf install -y augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx

# Create SSL Certificate With Certbot
sudo /opt/certbot/bin/certbot --nginx -d chess.rileygavigan.com <<EOF
rileygav@hotmail.com
Y
N
1
EOF

# Creates Nginx Config File
echo "Create an Nginx configuration file"
cat > /etc/nginx/conf.d/chess.conf <<EOL
server {
    server_name chess.rileygavigan.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/chess.rileygavigan.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chess.rileygavigan.com/privkey.pem;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if (\$host = chess.rileygavigan.com) {
        return 301 https://\$host\$request_uri;
    }
    listen 80;
    server_name chess.rileygavigan.com;
    return 404;
}
EOL

# Creates Systemd Service File
echo "Create a systemd service file"
cat > /etc/systemd/system/chess.rileygavigan.com.service <<EOL
[Unit]
Description=Hosted Chess Application for chess.rileygavigan.com
After=nginx.service
Wants=nginx.service

[Service]
Environment="LD_LIBRARY_PATH=/usr/local/lib"
Environment="WT_BASE=/usr/local"
ExecStart=/home/ec2-user/chess/main_app --docroot . --http-listen 127.0.0.1:8080
Restart=always
User=ec2-user
WorkingDirectory=/home/ec2-user/chess

[Install]
WantedBy=multi-user.target
EOL

# Starts Application
echo "Start the application"
systemctl daemon-reload
systemctl start chess.rileygavigan.com
systemctl enable chess.rileygavigan.com