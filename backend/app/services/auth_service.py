import httpx
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.crud.user import create_user, get_user_by_email
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


async def authenticate_or_create_google_user(db: AsyncSession, email: str) -> User:
    user = await get_user_by_email(db, email)
    if user:
        return user
    user = await create_user(
        db,
        email=email,
        hashed_password=None,
        auth_provider="google",
    )
    return user


async def register_local_user(db: AsyncSession, email: str, password: str) -> User:
    existing_user = await get_user_by_email(db, email)
    if existing_user is not None:
        raise ValueError("Email already registered")

    return await create_user(
        db,
        email=email,
        hashed_password=hash_password(password),
        auth_provider="local",
    )


async def authenticate_local_user(db: AsyncSession, email: str, password: str) -> User:
    user = await get_user_by_email(db, email)
    if user is None or user.hashed_password is None:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid credentials")

    return user
