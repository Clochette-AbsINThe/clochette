# Instruction for development of frontend

## Installation :

Start by `npm install`

Create a `.env.development` file where there is :

- NEXT_PUBLIC_BASE_URL=http://localhost:3000
- NEXT_PUBLIC_BACKEND_API_URL=https://clochette.dev/api/v1
- SECRET_KEY=\*\*\*\*\*\* #Same as the one in the backend

Have a look to the .env.sample file which should be working for development.

## Running:

You have to start the backend to be able to run the frontend in full mode.

Start `npm run dev` to start the development server.

## Commit and saving changes :

The CI will fail if `npm run format -- --check` and `npm run lint` are not launch before commiting to the repository.

Alternatively you can run `npm run precommit` to fix style issues.
