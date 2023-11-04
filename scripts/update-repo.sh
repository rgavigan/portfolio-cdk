#!/bin/bash
cd chess

echo "Takes ownership of repo and pulls from git"
sudo chown -R ec2-user:ec2-user /home/ec2-user/chess
git fetch
git pull

echo "Builds the application"
make clean
make

echo "Restarts the application"
sudo systemctl restart chess.rileygavigan.com.service