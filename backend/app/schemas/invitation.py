from pydantic import BaseModel

from app.schemas.event import EventResponse
from app.schemas.participant import ParticipantResponse
from app.schemas.template import TemplateResponse


class InvitationResponse(BaseModel):
    event: EventResponse
    participant: ParticipantResponse
    template: TemplateResponse
    field_data: dict[str, str]
