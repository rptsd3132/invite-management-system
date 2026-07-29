import uuid

import httpx
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.crud.user import (
    create_user,
    get_user_by_email,
    get_user_by_identifier,
    get_user_by_username,
)
from app.models.user import User


def verify_google_id_token(token: str) -> dict:
    try:
        id_info = id_token.verify_oauth2_token(
            token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
        if id_info.get("email_verified") is not True:
            raise ValueError("Email not verified by Google")
        return id_info
    except ValueError:
        raise


async def verify_google_access_token(access_token: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
    if resp.status_code != 200:
        raise ValueError("Invalid Google access token")
    return resp.json()


async def _generate_unique_username(
    db: AsyncSession, base: str
) -> str:
    candidate = base[:50].lower().replace(".", "_")
    existing = await get_user_by_username(db, candidate)
    if existing is None:
        return candidate
    for i in range(1, 100):
        candidate_i = f"{candidate[:45]}{i}"
        existing = await get_user_by_username(db, candidate_i)
        if existing is None:
            return candidate_i
    return f"user{uuid.uuid4().hex[:8]}"


async def authenticate_or_create_google_user(
    db: AsyncSession,
    email: str,
    first_name: str | None = None,
    last_name: str | None = None,
) -> User:
    user = await get_user_by_email(db, email)
    if user:
        return user
    username = await _generate_unique_username(db, email.split("@")[0])
    return await create_user(
        db,
        email=email,
        hashed_password=None,
        auth_provider="google",
        first_name=first_name,
        last_name=last_name,
        username=username,
    )


async def register_local_user(
    db: AsyncSession,
    first_name: str,
    last_name: str,
    username: str,
    email: str,
    password: str,
) -> User:
    existing_email = await get_user_by_email(db, email)
    if existing_email is not None:
        raise ValueError("Email already registered")

    existing_username = await get_user_by_username(db, username)
    if existing_username is not None:
        raise ValueError("Username already taken")

    return await create_user(
        db,
        email=email,
        hashed_password=hash_password(password),
        auth_provider="local",
        first_name=first_name,
        last_name=last_name,
        username=username,
    )


async def authenticate_local_user(
    db: AsyncSession, identifier: str, password: str
) -> User:
    user = await get_user_by_identifier(db, identifier)
    if user is None or user.hashed_password is None:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid credentials")

    return user
