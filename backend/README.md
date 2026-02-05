# Selenly Backend (FastAPI)

## Setup
1. Create a virtual environment inside `backend/`.
2. Install dependencies from `requirements.txt`.
3. Copy `.env.example` to `.env` and fill in `OPENAI_API_KEY` and `DATABASE_URL`.
4. Run migrations with `alembic upgrade head`.
5. Run the API with `uvicorn app.main:app --reload --port 8000`.

## Notes
- This is a starter MVP backend with Alembic migrations and Postgres support.
- SQLite still works for quick local tests if you set `DATABASE_URL` accordingly.
- The AI chat endpoint is a supportive companion and not a clinical therapy service.
- Auth includes refresh tokens, email verification tokens, and password reset tokens (email sending is stubbed).
- Moderation includes reporting posts and admin-only report review.

## Deploy (Render)
1. Create a new Render Web Service from the `backend/` folder.
2. Set environment variables in Render (match `.env.example`).
3. Run migrations manually from a Render shell: `alembic upgrade head`.
4. Health check path: `/health` (configured in `backend/render.yaml`).

## Deploy (Vercel)
1. Deploy the `my-app/` folder to Vercel.
2. Set `REACT_APP_API_URL` to your Render backend URL.

## Admin helper
Promote a user to admin:
1. `set ADMIN_EMAIL=you@example.com`
2. `python -m app.scripts.promote_admin`

## Logging
- Each request logs a structured line with `request_id`, method, path, status, and duration.
- The `X-Request-ID` response header is set for tracing.

## Demo seed data
1. `set DEMO_EMAIL=demo@selenly.com`
2. `set DEMO_PASSWORD=DemoPass123!`
3. `python -m app.scripts.seed_demo`
