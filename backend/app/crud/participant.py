import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.participant import Participant
from app.schemas.participant import ParticipantCreate


async def add_participants(
    db: AsyncSession,
    event_id: uuid.UUID,
    participants_data: list[ParticipantCreate],
) -> list[Participant]:
    participants = [
        Participant(
            event_id=event_id,
            guest_name=p.guest_name,
            email=p.email,
        )
        for p in participants_data
    ]
    db.add_all(participants)
    await db.commit()
    for p in participants:
        await db.refresh(p)
    return participants


async def get_participant_by_token(
    db: AsyncSession,
    token: uuid.UUID,
) -> Participant | None:
    result = await db.execute(
        select(Participant).where(Participant.unique_link_token == token)
    )
    return result.scalar_one_or_none()


async def delete_participant(
    db: AsyncSession,
    participant_id: uuid.UUID,
) -> bool:
    result = await db.execute(
        select(Participant).where(Participant.id == participant_id)
    )
    participant = result.scalar_one_or_none()
    if participant is None:
        return False
    await db.delete(participant)
    await db.commit()
    return True


async def update_rsvp_status(
    db: AsyncSession,
    token: uuid.UUID,
    rsvp_status: str,
    personal_note: str | None = None,
) -> Participant | None:
    participant = await get_participant_by_token(db, token)
    if participant is None:
        return None
    participant.rsvp_status = rsvp_status
    participant.personal_note = personal_note
    await db.commit()
    await db.refresh(participant)
    return participant
