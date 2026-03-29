# SkillBarter

SkillBarter is a modern MERN web app where users exchange skills instead of paying money.

Live product flow:
- User signs up or logs in
- User completes mandatory profile setup
- User enters the main feed and browses other users
- User sends a skill swap request
- Other user accepts or rejects the request
- Accepted users can message each other

## Features

- JWT authentication
- Protected routes
- Mandatory onboarding before app access
- User profile with:
  - name
  - bio
  - skills offered
  - skills wanted
- Feed of users in card format
- Swap request system with status flow:
  - pending
  - accepted
  - rejected
  - completed
- Dashboard for received and sent requests
- Messaging between accepted swap partners only
- Responsive UI for phone, tablet, and laptop

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication

## Project Structure

```text
frontend/
  src/
    components/
    pages/
    services/
    store/
    utils/

backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  scripts/
```

## Local Setup

### 1. Backend environment
Create `backend/.env`

```env
PORT=5001
MONGODB_URI=your-mongodb-connection-string
CLIENT_URL=http://localhost:5173
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ENABLE_REQUEST_LOGS=false
```

### 2. Frontend environment
Create `frontend/.env`

```env
VITE_API_URL=http://localhost:5001/api/v1
```

### 3. Install dependencies

```bash
npm install --workspace backend
npm install --workspace frontend
```

### 4. Start the app

Backend:
```bash
npm run dev --workspace backend
```

Frontend:
```bash
npm run dev --workspace frontend
```

## Demo Seed

Seed demo users and requests:

```bash
npm run seed --workspace backend
```

Demo accounts:
- `aarav@example.com / 123456`
- `meera@example.com / 123456`
- `rohan@example.com / 123456`

## API Routes

Auth:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `PATCH /api/v1/auth/onboarding`

Users:
- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `PATCH /api/v1/users/profile/me`

Swap Requests:
- `GET /api/v1/swaps`
- `POST /api/v1/swaps`
- `PATCH /api/v1/swaps/:id`

Dashboard:
- `GET /api/v1/dashboard`

Messages:
- `GET /api/v1/messages/contacts`
- `GET /api/v1/messages/:partnerId`
- `POST /api/v1/messages`
- `PATCH /api/v1/messages/:partnerId/read`

## Deploy Frontend on Vercel

Use the `frontend` folder as the Vercel project root.

Recommended Vercel settings:
- Framework preset: `Vite`
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Environment variable:

```env
VITE_API_URL=https://your-backend-url/api/v1
```

The file `frontend/vercel.json` is included for SPA routing.

## Deploy Backend

Deploy the backend separately on Render, Railway, or another Node hosting platform.

Backend environment variables required:
- `PORT`
- `MONGODB_URI`
- `CLIENT_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ENABLE_REQUEST_LOGS`

## GitHub Ready Notes

This repository is now cleaner for GitHub because:
- only the active product flow is kept in the main app
- setup instructions match the current codebase
- demo seed data is included
- deployment notes are included
- code is kept simple and readable for interviews

## Short Project Summary

SkillBarter is a full-stack MERN project where users create a skill profile, discover other users, send swap requests, manage request status, and message accepted swap partners.
