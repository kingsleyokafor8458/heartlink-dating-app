# ❤ HeartLink

A full-stack dating app: React (Vite + Tailwind) frontend, Spring Boot backend, MongoDB database.

## What's included

- **Landing page** styled to match your reference design (hero, feature badges, profile card grid, "Get Started" CTA).
- **Auth**: email/password signup & login with JWT.
- **Profiles**: view/edit your profile, browse other users.
- **Matching**: swipe like/pass, mutual-like creates a match.
- **Messaging**: chat within a match (polling-based; see "Next steps" for WebSocket upgrade).
- **Docker Compose** setup for one-command local run.

## Project structure

```
heartlink/
├── backend/     # Spring Boot (Java 17, Maven, MongoDB, JWT auth)
├── frontend/    # React (Vite, Tailwind, React Router)
└── docker-compose.yml
```

## Run locally

### Option A — Docker Compose (easiest)

```bash
cp .env.example .env      # edit JWT_SECRET at minimum
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- MongoDB: localhost:27017

### Option B — run each piece manually

**MongoDB** — install locally or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

**Backend**
```bash
cd backend
export MONGODB_URI="mongodb://localhost:27017/heartlink"
export JWT_SECRET="replace-with-a-long-random-string"
./mvnw spring-boot:run          # or: mvn spring-boot:run
```
API runs on http://localhost:8080. Swagger docs at `/swagger-ui.html`.

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
App runs on http://localhost:5173 and proxies `/api` calls to the backend.

## Deploying

- **Backend**: any Java host — Render, Railway, Fly.io, AWS Elastic Beanstalk/ECS. Point `MONGODB_URI` at a MongoDB Atlas cluster and set a strong `JWT_SECRET`.
- **Frontend**: Vercel, Netlify, or the included Nginx Dockerfile. Set `CORS_ALLOWED_ORIGINS` on the backend to your deployed frontend URL.
- **Database**: MongoDB Atlas free tier is enough to start.

## API overview

| Method | Endpoint              | Description                     |
|--------|------------------------|----------------------------------|
| POST   | /api/auth/signup       | Create account, returns JWT      |
| POST   | /api/auth/login        | Log in, returns JWT              |
| GET    | /api/me                | Current user's profile           |
| PUT    | /api/me                | Update current user's profile    |
| GET    | /api/browse            | Feed of profiles not yet swiped  |
| POST   | /api/swipe              | { targetId, action: LIKE\|PASS\|SUPER_LIKE } |
| GET    | /api/matches            | List of matches                  |
| GET    | /api/matches/profiles   | Profiles of matched users        |
| POST   | /api/messages           | { matchId, content }             |
| GET    | /api/messages/{matchId} | Conversation history             |

All endpoints except `/api/auth/**` require `Authorization: Bearer <token>`.

## Notes & next steps for a production launch

This is a solid, working scaffold — not a finished commercial product. Before real users touch it:

- **Photo uploads**: wire up S3/Cloudinary/similar; the profile form currently expects photo URLs. The landing page currently uses illustrated placeholder avatars (DiceBear) rather than real photos, since I can't generate or license real photos of people.
- **Real-time chat**: swap the polling in `Chat.jsx` for the WebSocket dependency already included in `pom.xml` (Spring `spring-boot-starter-websocket` + STOMP).
- **Safety**: add photo verification, reporting/blocking, and content moderation before any public launch — these are standard for dating apps and are not included here.
- **Email verification & password reset** flows aren't implemented yet.
- **Pagination** on `/browse` and `/matches` for scale.
- **Rate limiting** on auth endpoints.
