import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.event import Event
from app.schemas.event import EventCreate


async def create_event(
    db: AsyncSession,
    event_in: EventCreate,
    user_id: uuid.UUID,
) -> Event:
    event = Event(
        user_id=user_id,
        template_id=event_in.template_id,
        event_name=event_in.event_name,
        location=event_in.location,
        event_date=event_in.event_date,
        event_metadata=event_in.event_metadata,
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


async def get_events_by_user(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> list[Event]:
    result = await db.execute(
        select(Event)
        .where(Event.user_id == user_id)
        .order_by(Event.created_at.desc())
    )
    return list(result.scalars().all())


async def get_event_by_id(
    db: AsyncSession,
    event_id: uuid.UUID,
) -> Event | None:
    result = await db.execute(
        select(Event)
        .where(Event.id == event_id)
        .options(selectinload(Event.participants))
    )
    return result.scalar_one_or_none()
