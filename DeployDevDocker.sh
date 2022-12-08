#!/usr/bin/env bash

# Build the docker image
echo "Build the docker image"
echo
cd docker/clochette-dev || exit
docker-compose up -d --build
