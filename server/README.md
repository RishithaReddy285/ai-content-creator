# Server (Express) - AI Content Summarizer

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
cd server
npm install
```

3. Run in dev:

```bash
npm run dev
```

## Environment variables
See `.env.example`.

## Deploying
Recommended: Render or Railway.

- Create a new service, connect to this GitHub repo.
- Set the environment variables from `.env` in the service settings.
- Set the start command to `npm start`.

## MongoDB Atlas setup
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a project and a cluster (free tier OK)
3. Create a database user and whitelist your IPs (or allow access from anywhere during dev)
4. Copy connection string and set `MONGO_URI` in `.env`

## OpenAI API
Set `OPENAI_API_KEY` in `.env`.

## Notes
- Uploads are stored temporarily in `uploads/` and removed after extraction.
- Routes are under `/api/*`.
