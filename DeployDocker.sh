#!/usr/bin/env bash

# Build the frontend
echo "Building frontend"
echo
cd frontend || exit
npm run build
cd ..
echo

# Build the docker image
echo "Build the docker image"
echo
cd docker || exit
docker compose -f "docker-compose.yml" up -d --build
