import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.template import Template
from app.schemas.template import TemplateCreate


async def list_templates(db: AsyncSession) -> list[Template]:
    result = await db.execute(
        select(Template)
        .where(Template.user_id.is_(None))
        .order_by(Template.created_at.desc())
    )
    return list(result.scalars().all())


async def list_templates_by_user(db: AsyncSession, user_id: uuid.UUID) -> list[Template]:
    result = await db.execute(
        select(Template)
        .where(Template.user_id == user_id)
        .order_by(Template.created_at.desc())
    )
    return list(result.scalars().all())


async def get_template_by_id(db: AsyncSession, template_id: uuid.UUID) -> Template | None:
    result = await db.execute(select(Template).where(Template.id == template_id))
    return result.scalar_one_or_none()


async def create_template(
    db: AsyncSession,
    data: TemplateCreate,
    user_id: uuid.UUID,
) -> Template:
    template = Template(
        user_id=user_id,
        name=data.name,
        category=data.category,
        thumbnail_url=data.thumbnail_url,
        design_schema=data.design_schema,
    )
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return template