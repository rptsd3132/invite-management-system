from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    category: str
    thumbnail_url: str | None
    design_schema: dict
    created_at: datetime