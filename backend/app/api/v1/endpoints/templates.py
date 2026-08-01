from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.crud.template import get_template_by_id, list_templates
from app.schemas.template import TemplateResponse

router = APIRouter(prefix="/api/templates", tags=["templates"])


@router.get("", response_model=list[TemplateResponse])
async def read_templates(db: AsyncSession = Depends(get_db)) -> list[TemplateResponse]:
    return await list_templates(db)


@router.get("/{template_id}", response_model=TemplateResponse)
async def read_template(
    template_id: str,
    db: AsyncSession = Depends(get_db),
) -> TemplateResponse:
    template = await get_template_by_id(db, template_id)
    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    return template