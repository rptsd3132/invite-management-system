import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.template import Template


# ============================================================
# REQUIRED FIELDS
# ============================================================

WEDDING_FIELDS = [
    "event_name",
    "bride_name",
    "groom_name",
    "event_date_time",
    "event_location",
    "participant_name",
]

BIRTHDAY_FIELDS = [
    "event_name",
    "birthday_person_name",
    "age",
    "event_date_time",
    "event_location",
    "participant_name",
]

OFFICE_FIELDS = [
    "event_name",
    "company_name",
    "participant_name",
    "event_date_time",
    "event_location",
]


# ============================================================
# TEMPLATE BUILDER
# ============================================================

def make_template(
    name: str,
    category: str,
    image: str,
    style_key: str,
    required_fields: list[str],
    language: str,
    aspect_ratio: str,
) -> dict:
    return {
        "name": name,
        "category": category,
        "thumbnail_url": image,
        "design_schema": {
            "background_image": image,
            "background_position": "center",
            "background_size": "cover",

            "style_key": style_key,
            "category": category,
            "language": language,

            "required_fields": required_fields,

            # Important:
            # These six templates are rendered by custom React components.
            "renderer": "custom-react",

            "overlay_mode": "custom",
            "aspect_ratio": aspect_ratio,

            "layout": {},
            "static_texts": [],
        },
    }


# ============================================================
# ONLY THE SIX NEW TEMPLATES
# ============================================================

TEMPLATES_DATA = [
    # ========================================================
    # WEDDING - ENGLISH
    # ========================================================

    make_template(
        name="English Wedding",
        category="Wedding",
        image="wedding/assets/traditional-wedding-template.png",
        style_key="wedding-english-custom",
        required_fields=WEDDING_FIELDS,
        language="en",
        aspect_ratio="2 / 3",
    ),

    # ========================================================
    # WEDDING - SINHALA
    # ========================================================

    make_template(
        name="Sinhala Wedding",
        category="Wedding",
        image="wedding/assets/sinhala-wedding-template.jpg",
        style_key="wedding-sinhala-custom",
        required_fields=WEDDING_FIELDS,
        language="si",
        aspect_ratio="1.45 / 1",
    ),

    # ========================================================
    # BIRTHDAY - ENGLISH
    # ========================================================

    make_template(
        name="English Birthday",
        category="Birthday",
        image=(
            "birthday/assets/"
            "Purple and Pink Watercolor Birthday Invitation.png"
        ),
        style_key="birthday-english-custom",
        required_fields=BIRTHDAY_FIELDS,
        language="en",
        aspect_ratio="1046 / 1536",
    ),

    # ========================================================
    # BIRTHDAY - SINHALA
    # ========================================================

    make_template(
        name="Sinhala Birthday",
        category="Birthday",
        image="birthday/assets/sinhala-birthday-template.png",
        style_key="birthday-sinhala-custom",
        required_fields=BIRTHDAY_FIELDS,
        language="si",
        aspect_ratio="1046 / 1536",
    ),

    # ========================================================
    # OFFICE - ENGLISH
    # ========================================================

    make_template(
        name="English Office",
        category="Office",
        image="office/assets/office-ai-template.png",
        style_key="office-english-custom",
        required_fields=OFFICE_FIELDS,
        language="en",
        aspect_ratio="1 / 1",
    ),

    # ========================================================
    # OFFICE - SINHALA
    # ========================================================

    make_template(
        name="Sinhala Office",
        category="Office",
        image="office/assets/sinhala-office-ai-template.png",
        style_key="office-sinhala-custom",
        required_fields=OFFICE_FIELDS,
        language="si",
        aspect_ratio="1080 / 1350",
    ),
]


# ============================================================
# SEED FUNCTION
# ============================================================

async def seed_templates(db: AsyncSession) -> None:
    """
    Create the six new templates if they do not exist.

    If a template with the same name already exists,
    update its category, thumbnail and design schema.

    Old template records are NOT deleted here because
    existing events may still reference their template IDs.
    """

    result = await db.execute(select(Template))

    existing_templates = {
        template.name: template
        for template in result.scalars().all()
    }

    for template_data in TEMPLATES_DATA:
        existing = existing_templates.get(
            template_data["name"]
        )

        # --------------------------------------------
        # UPDATE EXISTING
        # --------------------------------------------

        if existing is not None:
            existing.category = (
                template_data["category"]
            )

            existing.thumbnail_url = (
                template_data["thumbnail_url"]
            )

            existing.design_schema = (
                template_data["design_schema"]
            )

            continue

        # --------------------------------------------
        # CREATE NEW
        # --------------------------------------------

        db.add(
            Template(
                id=uuid.uuid4(),
                name=template_data["name"],
                category=template_data["category"],
                thumbnail_url=template_data[
                    "thumbnail_url"
                ],
                design_schema=template_data[
                    "design_schema"
                ],
            )
        )

    await db.commit()