from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.participant import ParticipantResponse


class EventCreate(BaseModel):
    template_id: UUID
    event_name: str
    location: str
    event_date: datetime
    event_metadata: dict = {}


class EventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    template_id: UUID
    event_name: str
    location: str
    event_date: datetime
    event_metadata: dict
    created_at: datetime


class EventDetailResponse(EventResponse):
    participants: list[ParticipantResponse] = []
