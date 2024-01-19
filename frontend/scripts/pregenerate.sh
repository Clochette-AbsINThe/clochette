#! /bin/bash

cd ../backend || exit
poetry run python app/command.py openapi || exit
mv -f ./openapi.json ../frontend/src/openapi-codegen
