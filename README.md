# Weather to Stay or Not - Warden Assignment

A full-stack property search application with live weather-based filtering.

## Prerequisites

- Node.js 18+ and npm
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/citizenTwo/warden-test-one.git
cd warden-test-one
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run prisma:gen
```

Copy environment file:

```bash
cp .env.example .env
```

Your `.env` should contain:

```properties
DATABASE_URL=mysql://candidate_user:StrongPassword!123@arden-dev.c52ea4c0y1ao.ap-south-1.rds.amazonaws.com:3306/warden_test_one?connection_limit=30&pool_timeout=30
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

Expected output: `Server running on http://localhost:5000`

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
```

Create `.env.local`:

```bash
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
```

Start the frontend:

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Database Schema

No database schema changes were made. The existing `Property` table schema is used as-is.

## Environment Variables

### Backend (.env.example)

```properties
DATABASE_URL=mysql://candidate_user:StrongPassword!123@arden-dev.c52ea4c0y1ao.ap-south-1.rds.amazonaws.com:3306/warden_test_one?connection_limit=30&pool_timeout=30
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```properties
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running the Application

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser to `http://localhost:3000`

## Live Demo

- Frontend: https://warden-assignment.vercel.app/
- Backend API: https://warden-assignment-1.onrender.com/

## Troubleshooting

- Backend won't start: Verify database connection in `.env` and check if PORT 5000 is available
- Frontend can't connect: Ensure backend is running and `NEXT_PUBLIC_API_URL` is set correctly
- No results: Verify database contains properties with latitude/longitude values
