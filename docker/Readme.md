# When the app is set to the deployment you should add 2 important env files

## `.env` in the docker/ folder

- GITHUB_USER=\*\*\*
- GITHUB_TOKEN=\*\*\*
- REPOSITORY_NAME=\*\*\*
- REPOSITORY_OWNER=\*\*\*
- POSTGRES_PASSWORD=\*\*\*
- MIGRATE=\*\*\*
- JWT_SECRET_KEY=\*\*\*
- BASE_ACCOUNT_USERNAME=\*\*\*
- BASE_ACCOUNT_PASSWORD=\*\*\*
- LOCALE=fr #Or en

## `.env.production` in the frontend/ folder

- NEXT_PUBLIC_BASE_URL=\*\*\*
- NEXT_PUBLIC_BACKEND_API_URL=\*\*\*