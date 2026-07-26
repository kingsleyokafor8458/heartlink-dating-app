# ❤ HeartLink

A full-stack dating app: React (Vite + Tailwind) frontend, Spring Boot backend, MongoDB database.

## What's included

- **Landing page** styled to match your reference design (hero, feature badges, profile card grid, "Get Started" CTA).
- **Auth**: email/password signup & login with JWT, plus forgot/reset password via email.
- **Profiles**: view/edit your profile, upload photos, browse other users.
- **Matching**: swipe like/pass, mutual-like creates a match, undo your last swipe.
- **Who Liked You**: see (and instantly match with) people who already liked you.
- **Search & filters**: filter Discover by name, age range, city, or interest.
- **Messaging**: real-time chat over WebSocket (STOMP), plus a proper Messages inbox with previews and unread badges.
- **Safety**: report and block other users; blocked users are filtered out of browsing, swiping, and messaging.
- **App navigation**: Discover / Matches / Chat / Likes / Profile in the main nav (with unread badges); About, How It Works, Success Stories, and Contact live in a slide-out side menu instead of cluttering the app nav.
- **Marketing pages**: About, How It Works, Success Stories (sample testimonials), and a working Contact form.
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
| POST   | /api/auth/forgot-password | Request a password reset email |
| POST   | /api/auth/reset-password  | Reset password using a token   |
| GET    | /api/me                | Current user's profile           |
| PUT    | /api/me                | Update current user's profile    |
| GET    | /api/browse            | Feed of profiles not yet swiped (supports ?query, minAge, maxAge, city, interest) |
| POST   | /api/swipe              | { targetId, action: LIKE\|PASS\|SUPER_LIKE } |
| POST   | /api/swipe/undo         | Undo your most recent swipe      |
| GET    | /api/matches            | List of matches                  |
| GET    | /api/matches/profiles   | Profiles of matched users        |
| GET    | /api/likes/received     | Users who liked you but you haven't matched with yet |
| POST   | /api/messages           | { matchId, content } (REST fallback; prefer WebSocket below) |
| GET    | /api/messages           | Conversation inbox — one row per match with last message preview |
| GET    | /api/messages/unread-count | Total unread message count    |
| GET    | /api/messages/{matchId} | Full message history for one match (marks incoming messages read) |
| POST   | /api/reports            | { reportedUserId, reason, details } |
| POST   | /api/blocks/{userId}    | Block a user                     |
| DELETE | /api/blocks/{userId}    | Unblock a user                   |
| GET    | /api/blocks             | List of users you've blocked     |
| POST   | /api/contact            | Public — { name, email, message } from the Contact page |

All endpoints except `/api/auth/**` require `Authorization: Bearer <token>`.

Photo uploads: `POST /api/me/photos` (multipart `file` field, JPEG/PNG/WEBP, max 5MB, max 6 photos) and `DELETE /api/me/photos?url=<photoUrl>`.

### Real-time chat (WebSocket)

Connect to `ws://<host>/ws` (STOMP protocol) with an `Authorization: Bearer <token>` header on the CONNECT frame.

- Subscribe to `/topic/matches/{matchId}` to receive new messages for that match.
- Publish to `/app/chat.send` with body `{ "matchId": "...", "content": "..." }` to send one.

The frontend's `src/api/chatSocket.js` wraps this with `@stomp/stompjs`, and `Chat.jsx` uses it automatically — nothing to configure locally beyond `npm install`. Both the WebSocket path and the REST `POST /api/messages` fallback go through the same blocked-user check.

### Password reset emails

`POST /api/auth/forgot-password` generates a one-hour reset token and emails a link to `{FRONTEND_URL}/reset-password?token=...`. If `SMTP_HOST` isn't set, the backend logs the link to the console instead of sending an email — handy for local testing without a real mail server. Set `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD` (and optionally `SMTP_PORT`) to send real emails in production.

### Reporting & blocking

`POST /api/reports` records a report for manual review (stored in the `reports` collection — there's no admin UI yet, so review happens by querying MongoDB directly for now). `POST/DELETE /api/blocks/{userId}` blocks/unblocks a user; blocked users are automatically excluded from each other's browse feed and can't swipe on or message each other.

## Photo storage: local for testing, S3 for production

Storage is pluggable via one env var, `STORAGE_PROVIDER`:

- **`local` (default)** — files are saved to disk on the backend server and served back over HTTP. Good for local development and quick testing. Not suitable for a real deployment: files disappear on redeploy and won't work if you ever run more than one backend instance.
- **`s3`** — files are saved to an AWS S3 bucket. Use this once you deploy.

To switch to S3 for a real deployment:
1. Create an S3 bucket in AWS and allow public `GET` on the objects this app writes (prefix `photos/`), or put a CloudFront distribution in front of it.
2. Set these environment variables on your backend host: `STORAGE_PROVIDER=s3`, `S3_BUCKET=your-bucket-name`, `S3_REGION=us-east-1` (or your region).
3. Provide AWS credentials the SDK can find automatically — either `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` env vars, or (recommended) an IAM role attached to the EC2/ECS instance running the backend, so no keys are hardcoded anywhere.

No code changes needed to switch — `LocalStorageService` and `S3StorageService` both implement the same `StorageService` interface, and Spring picks the right one based on `STORAGE_PROVIDER`.

## Notes & next steps for a production launch

This is a solid, working scaffold — not a finished commercial product. Before real users touch it:

- **Photo/identity verification** and content moderation on uploaded photos aren't implemented — the "verified" checkmark in the UI isn't backed by a real check yet.
- **Success Stories page uses placeholder testimonials** (clearly labeled as sample content) — swap in real, consented stories once you have them.
- **Reports have no admin UI** — they're stored in MongoDB's `reports` collection for now; you'd query them directly or build a small review screen.
- **Email verification** on signup isn't implemented (password reset via email now is).
- **Pagination** on `/browse` and `/matches` for scale.
- **Rate limiting** on auth endpoints.
