#!/usr/bin/env bash

# If first arg is help, then display help
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Usage: ./DeployDocker.sh [init]"
    echo "  init: Init the DB, else migrate the DB"
    exit 0
fi

# Build the docker image
echo "Build the docker image"
echo
cd docker || exit
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# If first arg is init, then init the DB
if [ "$1" = "init" ]; then
    echo "Init DB"
    echo
    docker exec -it clochette-backend poetry run python app/command.py init -y
else
    echo "Migrate DB"
    echo
    docker exec -it clochette-backend poetry run python app/command.py migrate --bypass-revision
fi
