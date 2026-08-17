import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.crud.template import (
    create_template,
    get_template_by_id,
    list_templates,
    list_templates_by_user,
)
from app.models.user import User
from app.schemas.template import TemplateCreate, TemplateResponse

router = APIRouter(prefix="/api/templates", tags=["templates"])


@router.get("", response_model=list[TemplateResponse])
async def read_templates(db: AsyncSession = Depends(get_db)) -> list[TemplateResponse]:
    return await list_templates(db)


@router.get("/mine", response_model=list[TemplateResponse])
async def read_my_templates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TemplateResponse]:
    return await list_templates_by_user(db, current_user.id)


@router.post("", response_model=TemplateResponse, status_code=201)
async def create_new_template(
    template_in: TemplateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TemplateResponse:
    return await create_template(db, template_in, current_user.id)


@router.get("/{template_id}", response_model=TemplateResponse)
async def read_template(
    template_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> TemplateResponse:
    template = await get_template_by_id(db, template_id)
    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    return template