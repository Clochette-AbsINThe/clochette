#!/usr/bin/env bash

# Build the docker image
echo "Build the docker image"
echo
cd docker || exit
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

echo "Migrate DB"
echo 
docker exec -it clochette-backend poetry run python app/command.py migrate --bypass-revision
