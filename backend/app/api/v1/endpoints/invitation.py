import uuid

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.dependencies import get_db
from app.crud.participant import get_participant_by_token, update_rsvp_status
from app.models.event import Event
from app.models.participant import Participant
from app.models.template import Template
from app.schemas.invitation import InvitationResponse
from app.schemas.participant import ParticipantResponse, RsvpUpdate
from fastapi import Depends

router = APIRouter(prefix="/api/v1/invitation", tags=["invitation"])


def _build_field_data(
    event: Event,
    participant: Participant,
) -> dict[str, str]:
    metadata = dict(event.event_metadata) if event.event_metadata else {}
    metadata["participant_name"] = participant.guest_name
    metadata["event_location"] = event.location
    if "event_date_time" not in metadata:
        metadata["event_date_time"] = event.event_date.strftime(
            "%A, %B %d, %Y at %I:%M %p"
        )
    if "event_name" not in metadata:
        metadata["event_name"] = event.event_name
    return metadata


@router.get("/{token}", response_model=InvitationResponse)
async def read_invitation(
    token: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> InvitationResponse:
    participant = await get_participant_by_token(db, token)
    if participant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found",
        )

    result = await db.execute(
        select(Event)
        .where(Event.id == participant.event_id)
        .options(selectinload(Event.template))
    )
    event = result.scalar_one_or_none()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    template = event.template
    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    field_data = _build_field_data(event, participant)

    return InvitationResponse(
        event=event,
        participant=participant,
        template=template,
        field_data=field_data,
    )


@router.patch("/{token}/rsvp", response_model=ParticipantResponse)
async def submit_rsvp(
    token: uuid.UUID,
    payload: RsvpUpdate,
    db: AsyncSession = Depends(get_db),
) -> ParticipantResponse:
    if payload.rsvp_status not in ("accepted", "declined"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="rsvp_status must be 'accepted' or 'declined'",
        )
    participant = await update_rsvp_status(
        db, token, payload.rsvp_status, payload.personal_note
    )
    if participant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found",
        )
    return participant
