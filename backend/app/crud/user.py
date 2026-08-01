import uuid

from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_username(
    db: AsyncSession, username: str
) -> User | None:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def get_user_by_identifier(
    db: AsyncSession, identifier: str
) -> User | None:
    result = await db.execute(
        select(User).where(
            or_(User.email == identifier, User.username == identifier)
        )
    )
    return result.scalar_one_or_none()


async def create_user(
    db: AsyncSession,
    email: str,
    hashed_password: str | None = None,
    auth_provider: str = "local",
    role: str = "organizer",
    first_name: str | None = None,
    last_name: str | None = None,
    username: str | None = None,
) -> User:
    user = User(
        email=email,
        hashed_password=hashed_password,
        auth_provider=auth_provider,
        role=role,
        first_name=first_name,
        last_name=last_name,
        username=username,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
