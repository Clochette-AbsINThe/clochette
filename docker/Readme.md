# When the app is set to the deployment you should add 1 important env files

## `.env` in the docker/ folder

- GITHUB_USER=\*\*\*
- GITHUB_TOKEN=\*\*\*
- REPOSITORY_NAME=\*\*\*
- REPOSITORY_OWNER=\*\*\*
- POSTGRES_PASSWORD=\*\*\*
- SECRET_KEY=\*\*\*
- BASE_ACCOUNT_USERNAME=\*\*\*
- BASE_ACCOUNT_PASSWORD=\*\*\*
- LOCALE=fr # Or en

## The `db-shared-volume` folder

This folder is used to store the database data. It is mount as a volume for the clochette-backend container under the `/root/db-shared-volume` path.

You can use the following command to dump the database:

```bash
docker exec -it clochette-backend poetry run python app/command.py dump -o /root/db-shared-volume/dump.json
```

You can use the following command to load the database:

```bash
docker exec -it clochette-backend poetry run python app/command.py load -i /root/db-shared-volume/dump.json
```

If you want to migrate the database, you can use the following command:

```bash
docker exec -it clochette-backend poetry run python app/command.py migrate
```
