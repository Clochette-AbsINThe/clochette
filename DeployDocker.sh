#!/usr/bin/env bash

# Build the docker image
echo "Build the docker image"
echo
cd docker || exit
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
