# Invite Management System

> A full-stack platform for creating, managing, and tracking event invitations with customizable templates.

## Overview

The Invite Management System enables event organizers to create personalized invitations from pre-designed templates, manage guest lists, and track RSVP responses in real-time. Built with a modern microservices architecture, it supports Google OAuth authentication, multi-language templates (English/Sinhala), and location-based event planning.

## Features

### Implemented
- **Authentication** — JWT-based login/register + Google OAuth
- **Template Gallery** — Browse invitation templates by category (Wedding, Birthday, Corporate)
- **Template Preview** — Live preview with multi-language support (English/Sinhala)
- **Event Creation Wizard** — Step-by-step event setup with template selection
- **Guest Management** — Add participants individually or via CSV bulk upload
- **Invitation Tracking** — Unique token-based invitation links with view tracking
- **RSVP System** — Guests can respond (Attending/Declined) via public invitation page
- **Organizer Dashboard** — Overview of events, guest statistics, and RSVP summary
- **Location Picker** — Interactive map for event venue selection (Leaflet)

### Planned
- Admin dashboard with aggregated analytics
- Background email notifications (Celery + Redis)
- Invitation PDF generation
- Rate limiting on auth endpoints

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript 6, Vite 8, Tailwind CSS 4 |
| **Backend** | FastAPI (Python 3.12), SQLAlchemy 2.0, Alembic |
| **Database** | PostgreSQL 16 (SQLite fallback for local dev) |
| **Task Queue** | Celery + Redis |
| **Auth** | JWT (PyJWT), Google OAuth (google-auth) |
| **State Management** | Zustand (client), TanStack React Query (server) |
| **Forms** | React Hook Form + Zod validation |
| **Maps** | Leaflet + React-Leaflet |
| **Infrastructure** | Docker Compose (5 services) |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Compose                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │───▶│   Backend    │───▶│  PostgreSQL   │  │
│  │  (React/Vite)│    │  (FastAPI)   │    │   (Database)  │  │
│  │   :5173      │    │   :8000      │    │   :5432       │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                             │                               │
│                             ▼                               │
│                      ┌──────────────┐                       │
│                      │    Redis     │                       │
│                      │  (Broker)    │                       │
│                      │   :6379      │                       │
│                      └──────┬───────┘                       │
│                             │                               │
│                             ▼                               │
│                      ┌──────────────┐                       │
│                      │ Celery Worker│                       │
│                      │  (Background │                       │
│                      │    Tasks)    │                       │
│                      └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- **Docker & Docker Compose** (recommended) — or manual setup below
- **Node.js 18+** — for frontend development
- **Python 3.12+** — for backend development
- **PostgreSQL 16** — if running without Docker

## Quick Start (Docker)

```bash
# Clone the repository
git clone <repository-url>
cd invite-management-system

# Start all services
docker compose up --build

# Access the application
# Frontend:  http://localhost:5173
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
```

## Local Development

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment (SQLite auto-used for localhost)
cp .env.example .env  # or create manually

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Project Structure

```
invite-management-system/
├── docker-compose.yml          # Service orchestration
├── schema.sql                  # Database schema reference
├── project_overview.md         # Technical reference (for AI tools)
│
├── backend/
│   ├── app/
│   │   ├── api/                # API routes (auth, events, templates)
│   │   ├── core/               # Config, database, security, dependencies
│   │   ├── crud/               # Database operations
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   └── db/                 # Seed data
│   ├── tests/                  # Pytest test suite
│   ├── alembic/                # Database migrations
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   │   ├── auth/           # Authentication components
    │   │   ├── dashboard/      # Dashboard widgets
    │   │   ├── events/         # Event creation wizard
    │   │   ├── layout/         # Navbar, Layout
    │   │   ├── ui/             # Primitives (Button, Card, Input)
    │   │   └── assets/         # Template designs (wedding, birthday, etc.)
    │   ├── pages/              # Route pages
    │   ├── hooks/              # Custom React hooks
    │   ├── lib/                # Utilities, API client, validators
    │   ├── store/              # Zustand stores
    │   └── types/              # TypeScript type definitions
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/v1/health` | Health check | No |
| `POST` | `/api/auth/register` | Register new account | No |
| `POST` | `/api/auth/login` | Login (returns JWT) | No |
| `POST` | `/api/auth/google` | Google OAuth login | No |
| `GET` | `/api/templates` | List all templates | No |
| `GET` | `/api/templates/:id` | Get template details | No |
| `POST` | `/api/events` | Create new event | Yes |
| `GET` | `/api/events` | List user's events | Yes |
| `GET` | `/api/events/:id` | Get event details | Yes |
| `PUT` | `/api/events/:id` | Update event | Yes |
| `DELETE` | `/api/events/:id` | Delete event | Yes |
| `POST` | `/api/events/:id/participants` | Add participants (CSV/bulk) | Yes |
| `GET` | `/api/events/:id/participants` | List participants + RSVP stats | Yes |
| `PUT` | `/api/participants/:id/rsvp` | Update RSVP status | Yes |
| `GET` | `/api/invitation/:token` | Public invitation page | No |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database username | `admin` |
| `POSTGRES_PASSWORD` | Database password | `adminpassword` |
| `POSTGRES_SERVER` | Database host (`localhost` = SQLite fallback) | `localhost` |
| `POSTGRES_PORT` | Database port | `5432` |
| `POSTGRES_DB` | Database name | `invite_system` |
| `JWT_SECRET_KEY` | Secret for JWT signing | *(required)* |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | `7` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | *(required for Google auth)* |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | *(required for Google auth)* |

## Testing

```bash
cd backend

# Run all tests
pytest

# Verbose output
pytest -v

# Run specific test file
pytest tests/test_local_auth.py

# Stop on first failure
pytest -x
```

## Database Migrations

```bash
cd backend

# Generate migration after model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

> **Note:** Tables are auto-created on app startup via `Base.metadata.create_all`. Alembic is configured but migrations are not yet active.

## Roadmap

- [ ] Complete event CRUD API endpoints
- [ ] Implement participant management with CSV upload
- [ ] Add Celery background tasks for email notifications
- [ ] Build admin dashboard with aggregated analytics
- [ ] Add rate limiting on authentication endpoints
- [ ] Generate invitation PDFs
- [ ] Add invitation email templates

## License

*To be determined*
