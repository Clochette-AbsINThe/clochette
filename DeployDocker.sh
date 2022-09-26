#!/usr/bin/env bash

# Build the frontend
echo "Building frontend"
echo
cd frontend || exit
npm run build
cd ..
echo

# Build the tar conf for Nginx
echo "Create the tar conf for Nginx"
echo
cd docker/frontend || exit
tar -czvf nginxconfig.io-clochette.dev.tar.gz ./nginxconfig.io-clochette.dev/
cd ../
echo

# Build the docker image
echo "Build the docker image"
echo
docker compose -f "docker-compose.yml" up -d --build
