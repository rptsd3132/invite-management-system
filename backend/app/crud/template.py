from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.template import Template


async def list_templates(db: AsyncSession) -> list[Template]:
    result = await db.execute(select(Template).order_by(Template.created_at.desc()))
    return list(result.scalars().all())


async def get_template_by_id(db: AsyncSession, template_id: str) -> Template | None:
    result = await db.execute(select(Template).where(Template.id == template_id))
    return result.scalar_one_or_none()