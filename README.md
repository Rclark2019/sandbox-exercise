# Local Development Sandbox Application

This repo contains a simple full-stack app that lets you save text to either AWS S3 or a local Postgres database.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: Postgres (Docker Compose)
- Storage: AWS S3

## Prerequisites
- Node.js 18+
- Docker + Docker Compose
- AWS CLI configured for your sandbox account

## Environment Variables

### Backend
Create `backend/.env` based on `backend/.env.example`.

Required:
- `BACKEND_PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `AWS_REGION`
- `AWS_PROFILE` (when using a named AWS profile)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`

### Database
Create `db/.env` based on `db/.env.example`.

Required:
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`

### Frontend
Create `frontend/.env` based on `frontend/.env.example`.

Required:
- `VITE_API_BASE` (example: `http://localhost:4000`)

## AWS S3 Setup
1. Configure AWS CLI locally (if not already):
   ```bash
   aws configure
   ```
2. Create a bucket (example):
   ```bash
   aws s3 mb s3://your-s3-bucket-name-here
   ```
3. Set `S3_BUCKET_NAME` in `backend/.env`.

## Database Setup (Docker)
From the `db` directory:

Start Postgres:
```bash
cd db

# Load env vars from db/.env
# Mac/Linux: Docker Compose automatically reads .env in this folder

docker compose up -d
```

Stop Postgres:
```bash
cd db

docker compose down
```

The database initializes a `text_entries` table with:
- `id`
- `content`
- `created_at`

## Run the App

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the frontend at:
- `http://localhost:5173`

## API Endpoints
- `POST /api/storage` — saves text to S3
- `POST /api/database` — saves text to Postgres

Both endpoints accept JSON:
```json
{ "text": "hello" }
```

## Notes
- The frontend calls the backend API only. It does not access AWS or Postgres directly.
- Object keys in S3 include a timestamp to ensure uniqueness.
