from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.participant import ParticipantResponse


class EventCreate(BaseModel):
    template_id: UUID
    event_name: str
    location: str
    event_date: datetime
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    event_metadata: dict[str, Any] = Field(default_factory=dict)


class EventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    template_id: UUID
    event_name: str
    location: str
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    event_date: datetime
    event_metadata: dict
    created_at: datetime


class EventDetailResponse(EventResponse):
    participants: list[ParticipantResponse] = []
