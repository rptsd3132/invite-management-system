import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.crud.event import create_event, get_event_by_id, get_events_by_user
from app.crud.participant import add_participants, delete_participant
from app.models.user import User
from app.schemas.event import EventCreate, EventDetailResponse, EventResponse
from app.schemas.participant import (
    ParticipantBulkCreate,
    ParticipantCreate,
    ParticipantResponse,
)

router = APIRouter(prefix="/api/v1/events", tags=["events"])


@router.post("", response_model=EventResponse, status_code=201)
async def create_new_event(
    event_in: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EventResponse:
    return await create_event(db, event_in, current_user.id)


@router.get("", response_model=list[EventResponse])
async def read_events(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[EventResponse]:
    return await get_events_by_user(db, current_user.id)


@router.get("/{event_id}", response_model=EventDetailResponse)
async def read_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EventDetailResponse:
    event = await get_event_by_id(db, event_id)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    if event.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this event",
        )
    return event


@router.post(
    "/{event_id}/participants",
    response_model=list[ParticipantResponse],
    status_code=201,
)
async def add_event_participants(
    event_id: uuid.UUID,
    payload: ParticipantBulkCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ParticipantResponse]:
    event = await get_event_by_id(db, event_id)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    if event.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this event",
        )
    return await add_participants(db, event_id, payload.participants)


@router.delete(
    "/{event_id}/participants/{participant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_event_participant(
    event_id: uuid.UUID,
    participant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    event = await get_event_by_id(db, event_id)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    if event.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this event",
        )
    deleted = await delete_participant(db, participant_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found",
        )
