# NewLocalKartWebsite

This repository has two apps:

- `backend`: Express API with MongoDB, authentication, orders, contact, and chatbot routes
- `frontend`: Next.js storefront that talks to the backend API

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

1. Install dependencies for both apps.

```bash
cd backend
npm install

cd ..\frontend
npm install
```

2. Create environment files.

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env.local`

3. Start MongoDB if you are using the local default connection.

4. Run the backend and frontend in separate terminals.

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

5. Open the frontend at `http://localhost:3000`.

## Environment

The frontend defaults to `http://localhost:5000/api` if `NEXT_PUBLIC_API_URL` is not set.

The backend can run with sensible defaults for local development, but you should set real values for:

- `MONGO_URI`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_RECIPIENT_EMAIL`
- `GEMINI_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## VS Code tasks

If you open the workspace in VS Code, use the task runner to install or start each app.
