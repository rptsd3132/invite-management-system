from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ParticipantCreate(BaseModel):
    guest_name: str
    email: str | None = None


class ParticipantBulkCreate(BaseModel):
    participants: list[ParticipantCreate]


class ParticipantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    event_id: UUID
    guest_name: str
    email: str | None
    unique_link_token: UUID
    rsvp_status: str
    created_at: datetime
