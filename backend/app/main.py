from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.v1.endpoints.templates import router as templates_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.events import router as events_router
from app.api.v1.endpoints.invitation import router as invitation_router
from app.core.database import Base, engine, async_session_factory

# Ensure the model metadata is loaded before creating tables.
from app.models import Template, User, Event, Participant  # noqa: F401

@asynccontextmanager
async def lifespan(application: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session_factory() as session:
        from app.db.seed_templates import seed_templates
        await seed_templates(session)
    yield
    await engine.dispose()

app = FastAPI(
    title="Invite Management System API",
    version="0.1.0",
    description="Backend API for the invite management platform",
    lifespan=lifespan,
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(templates_router)
app.include_router(events_router)
app.include_router(invitation_router)