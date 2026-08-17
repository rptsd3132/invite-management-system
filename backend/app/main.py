from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.v1.endpoints.events import router as events_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.invitation import router as invitation_router
from app.api.v1.endpoints.templates import router as templates_router
from app.core.database import Base, async_session_factory, engine

# Load all models before creating database tables.
from app.models import Event, Participant, Template, User  # noqa: F401


@asynccontextmanager
async def lifespan(application: FastAPI):
    # Create tables that do not already exist.
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    # Insert or update the default invitation templates.
    async with async_session_factory() as session:
        from app.db.seed_templates import seed_templates

        await seed_templates(session)

    yield

    # Close the database engine when the application stops.
    await engine.dispose()


app = FastAPI(
    title="Invite Management System API",
    version="0.1.0",
    description="Backend API for the invite management platform",
    lifespan=lifespan,
)

<<<<<<< HEAD
origins = [
=======

# Frontend URLs allowed to access the backend API.
allowed_origins = [
>>>>>>> main
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register application routers.
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(templates_router)
app.include_router(events_router)
app.include_router(invitation_router)