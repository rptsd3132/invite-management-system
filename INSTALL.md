# Installation Guide

Step-by-step instructions to clone, install, and run the Invite Management System.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone Repository](#2-clone-repository)
3. [Quick Start (Docker)](#3-quick-start-docker)
4. [Local Development Setup](#4-local-development-setup)
5. [First Time Setup](#5-first-time-setup)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Database Configuration](#7-database-configuration)
8. [Running the Application](#8-running-the-application)
9. [Running Tests](#9-running-tests)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

### Required

| Tool | Version | Purpose |
|------|---------|---------|
| **Git** | Latest | Clone the repository |
| **Docker & Docker Compose** | v20.10+ / v2.0+ | Run all services (recommended method) |

### For Local Development (without Docker)

| Tool | Version | Purpose |
|------|---------|---------|
| **Python** | 3.12+ | Backend server |
| **Node.js** | 18+ | Frontend build tool |
| **npm** | 9+ | Package manager |

### Verify Installation

```bash
# Check Git
git --version

# Check Docker
docker --version
docker compose version

# Check Python (for local development)
python --version

# Check Node.js (for local development)
node --version
npm --version
```

---

## 2. Clone Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd invite-management-system
```

---

## 3. Quick Start (Docker)

This is the fastest way to run the entire application. Docker Compose will build and start all 5 services automatically.

```bash
# Make sure you're in the project root directory
cd invite-management-system

# Build and start all services
docker compose up --build
```

### What This Does

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| PostgreSQL | `invite_db` | `:5432` | Database |
| Redis | `invite_redis` | `:6379` | Message broker |
| Backend | `invite_backend` | `:8000` | FastAPI server |
| Celery Worker | `invite_celery_worker` | — | Background tasks |
| Frontend | `invite_frontend` | `:5173` | React UI |

### Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **API Documentation (Swagger)** | http://localhost:8000/docs |
| **API Documentation (ReDoc)** | http://localhost:8000/redoc |

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

---

## 4. Local Development Setup

### 4.1 Backend Setup

#### Mac / Linux

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from example or create manually)
cp .env.example .env 2>/dev/null || touch .env

# Edit .env with your configuration (see Section 6)
# Minimum required: JWT_SECRET_KEY

# Start the server
uvicorn app.main:app --reload --port 8000
```

#### Windows (Command Prompt)

```cmd
:: Navigate to backend directory
cd backend

:: Create virtual environment
python -m venv venv

:: Activate virtual environment
venv\Scripts\activate

:: Install dependencies
pip install -r requirements.txt

:: Create .env file
copy NUL .env

:: Edit .env with your configuration (see Section 6)
:: Minimum required: JWT_SECRET_KEY

:: Start the server
uvicorn app.main:app --reload --port 8000
```

#### Windows (PowerShell)

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get an execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt

# Create .env file
New-Item -Path .env -ItemType File

# Edit .env with your configuration (see Section 6)

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 4.2 Frontend Setup

Open a **new terminal window/tab** (keep the backend running).

#### All Operating Systems

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env  # Mac/Linux
# or: echo. > .env  # Windows Command Prompt
# or: New-Item -Path .env -ItemType File  # PowerShell

# Edit .env with your configuration (see Section 6)
# Required: VITE_API_BASE_URL=http://localhost:8000

# Start the development server
npm run dev
```

---

## 5. First Time Setup

### 5.1 Google OAuth Configuration

To enable Google Sign-In, you need to create OAuth credentials in Google Cloud Console.

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `invite-management-system`
4. Click **Create**

#### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type → Click **Create**
3. Fill in:
   - App name: `Invite Management System`
   - User support email: Your email
   - Developer contact: Your email
4. Click **Save and Continue**
5. On **Scopes** page, click **Add or Remove Scopes**:
   - Select `email` and `openid`
   - Click **Update** → **Save and Continue**
6. On **Test users** page, add your Google email
7. Click **Save and Continue** → **Back to Dashboard**

#### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Name: `Invite Management System`
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173`
   - `http://localhost:8000`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:5173`
   - `http://localhost:8000`
7. Click **Create**
8. Copy the **Client ID**

#### Step 4: Add Client ID to Environment Files

**Backend** (`backend/.env`):
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Frontend** (`frontend/.env`):
```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 5.2 JWT Secret Configuration

For security, you must set a unique JWT secret key.

#### Generate a Secure Key

```bash
# Mac/Linux
python -c "import secrets; print(secrets.token_hex(32))"

# Windows (same command)
python -c "import secrets; print(secrets.token_hex(32))"
```

#### Add to Backend `.env`

```env
JWT_SECRET_KEY=your-generated-secret-key-here
```

> **Important:** Never commit `.env` files to version control. The `.gitignore` is configured to exclude them.

---

## 6. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `POSTGRES_USER` | No | Database username | `admin` |
| `POSTGRES_PASSWORD` | No | Database password | `adminpassword` |
| `POSTGRES_SERVER` | No | Database host (`localhost` = SQLite fallback) | `localhost` |
| `POSTGRES_PORT` | No | Database port | `5432` |
| `POSTGRES_DB` | No | Database name | `invite_system` |
| `JWT_SECRET_KEY` | **Yes** | Secret key for JWT token signing | *(must be set)* |
| `JWT_ALGORITHM` | No | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | Access token expiry (minutes) | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | No | Refresh token expiry (days) | `7` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID (for Google Sign-In) | `""` |
| `REDIS_URL` | No | Redis connection URL | `redis://localhost:6379/0` |

### Frontend (`frontend/.env`)

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | No | Backend API base URL | `http://localhost:8000` |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth Client ID (for Google Sign-In) | `""` |

### Example `.env` Files

**Backend** (`backend/.env`):
```env
# Database (SQLite auto-used when POSTGRES_SERVER=localhost)
POSTGRES_USER=admin
POSTGRES_PASSWORD=adminpassword
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=invite_system

# JWT (generate a secure key for production)
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth (optional, for Google Sign-In)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Redis (for background tasks)
REDIS_URL=redis://localhost:6379/0
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

---

## 7. Database Configuration

### SQLite (Default for Local Development)

When `POSTGRES_SERVER` is set to `localhost` or `127.0.0.1`, the application automatically uses SQLite. No additional database setup is required.

```env
# backend/.env
POSTGRES_SERVER=localhost  # Triggers SQLite fallback
```

The SQLite database file (`invite_management.db`) is created automatically on first run.

### PostgreSQL (Docker or Remote)

When `POSTGRES_SERVER` is set to a non-localhost value, the application connects to PostgreSQL.

```env
# backend/.env
POSTGRES_SERVER=db  # Use Docker service name
POSTGRES_USER=admin
POSTGRES_PASSWORD=adminpassword
POSTGRES_DB=invite_system
```

### Database Migrations

Tables are auto-created on app startup via `Base.metadata.create_all`. For manual migrations:

```bash
cd backend

# Generate migration after model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

---

## 8. Running the Application

### Using Docker (Recommended)

```bash
# Start all services
docker compose up --build

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down
```

### Running Locally

You need **two terminal windows/tabs**:

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate  # Mac/Linux
# or: venv\Scripts\activate  # Windows

uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### Verify Services Are Running

```bash
# Test backend health
curl http://localhost:8000/api/v1/health

# Test frontend
curl http://localhost:5173
```

---

## 9. Running Tests

### Backend Tests

```bash
cd backend

# Activate virtual environment (if not already active)
source venv/bin/activate  # Mac/Linux
# or: venv\Scripts\activate  # Windows

# Run all tests
pytest

# Verbose output
pytest -v

# Run specific test file
pytest tests/test_local_auth.py

# Run with coverage
pytest --cov=app

# Stop on first failure
pytest -x
```

### Frontend Linting

```bash
cd frontend

# Run ESLint
npm run lint

# Build for production
npm run build
```

---

## 10. Troubleshooting

### Port Already in Use

**Error:** `Address already in use` or `Port 8000/5173 is already allocated`

**Solution:**
```bash
# Find process using the port (Mac/Linux)
lsof -i :8000
lsof -i :5173

# Kill the process (Mac/Linux)
kill -9 <PID>

# Find process using the port (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

Or change the port:
```bash
# Backend - use different port
uvicorn app.main:app --reload --port 8001

# Frontend - use different port
npm run dev -- --port 5174
```

### Database Connection Error

**Error:** `Connection refused` or `could not connect to server`

**Solution:**
- If using SQLite (localhost), ensure `POSTGRES_SERVER=localhost` in `backend/.env`
- If using PostgreSQL, ensure Docker is running: `docker compose up db`

### Google OAuth Not Working

**Error:** `Google Sign-In button doesn't appear` or `Invalid client ID`

**Solution:**
1. Verify `VITE_GOOGLE_CLIENT_ID` is set in `frontend/.env`
2. Verify `GOOGLE_CLIENT_ID` is set in `backend/.env`
3. Ensure both Client IDs are the same
4. Check Google Cloud Console:
   - OAuth consent screen is configured
   - `http://localhost:5173` is in Authorized JavaScript origins
   - Your email is added as a test user

### Frontend Build Errors

**Error:** `Module not found` or `Cannot find package`

**Solution:**
```bash
cd frontend
rm -rf node_modules
npm install
```

### Backend Import Errors

**Error:** `ModuleNotFoundError: No module named 'app'`

**Solution:**
```bash
cd backend
# Ensure you're in the backend directory
# Ensure virtual environment is activated
source venv/bin/activate  # Mac/Linux
# or: venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

### Docker Build Fails

**Error:** `failed to solve: frontend:failed to fetch metadata`

**Solution:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild
docker compose up --build
```

### SQLite Database Issues

**Error:** `database is locked` or `unable to open database file`

**Solution:**
```bash
# Delete the SQLite database and restart
cd backend
rm invite_management.db
uvicorn app.main:app --reload --port 8000
```

---

## Quick Reference

### Service Ports

| Service | Port |
|---------|------|
| Frontend | 5173 |
| Backend API | 8000 |
| PostgreSQL | 5432 |
| Redis | 6379 |

### Useful Commands

```bash
# Docker
docker compose up --build          # Start all services
docker compose down                # Stop all services
docker compose logs -f             # View logs
docker compose ps                  # List running services

# Backend
uvicorn app.main:app --reload      # Start with auto-reload
pytest                             # Run tests

# Frontend
npm run dev                        # Start dev server
npm run build                      # Production build
npm run lint                       # Run linter
```

---

## Next Steps

- Review [PROJECT-OVERVIEW.md](PROJECT-OVERVIEW.md) for architecture details
- Check [project_overview.md](project_overview.md) for technical reference
- Visit http://localhost:8000/docs for API documentation
