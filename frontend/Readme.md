# Instruction for development of frontend

## Installation :

Start by `npm install`

Create a `.env.development` file where there is :

-   NEXT_PUBLIC_BASE_URL=http://localhost:3000
-   NEXT_PUBLIC_BACKEND_API_URL=https://clochette.dev/api/v1

## Running:

You have to start the `DeployDocker.sh` script to make the backend accessible.

Start `npm run dev` to start the development server.

## Commit and saving changes :

The CI will fail if `npm run format -- --check` and `npm run lint` are not launch before commiting to the repository.

Alternatively you can run `npm run precommit` to fix style issues.
