import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.template import Template


TEMPLATES_DATA = [
    {
        "name": "Arch Botanical",
        "category": "Wedding",
        "thumbnail_url": "wedding/arch-botanical.jpg",
        "design_schema": {
            "background_image": "wedding/arch-botanical.jpg",
            "background_position": "center",
            "style_key": "wedding-botanical",
            "category": "Wedding",
            "badge_text": "Wedding invitation",
            "eyebrow_text": "Together with their families",
            "required_fields": [
                "event_name", "bride_name", "groom_name",
                "event_date_time", "event_location", "participant_name",
            ],
        },
    },
    {
        "name": "Minimalist Typography",
        "category": "Wedding",
        "thumbnail_url": "wedding/minimalist.jpg",
        "design_schema": {
            "background_image": "wedding/minimalist.jpg",
            "background_position": "center",
            "style_key": "wedding-minimal",
            "category": "Wedding",
            "badge_text": "Save the date",
            "eyebrow_text": "We request the pleasure of your company",
            "required_fields": [
                "event_name", "bride_name", "groom_name",
                "event_date_time", "event_location", "participant_name",
            ],
        },
    },
    {
        "name": "Elegant Gold & Navy",
        "category": "Wedding",
        "thumbnail_url": "wedding/elegant-gold-navy.jpg",
        "design_schema": {
            "background_image": "wedding/elegant-gold-navy.jpg",
            "background_position": "center",
            "style_key": "wedding-luxury",
            "category": "Wedding",
            "badge_text": "A celebration of love",
            "eyebrow_text": "You are cordially invited",
            "required_fields": [
                "event_name", "bride_name", "groom_name",
                "event_date_time", "event_location", "participant_name",
            ],
        },
    },
    {
        "name": "Whimsical Pastel",
        "category": "Wedding",
        "thumbnail_url": "wedding/whimsical-pastel.jpg",
        "design_schema": {
            "background_image": "wedding/whimsical-pastel.jpg",
            "background_position": "center",
            "style_key": "wedding-pastel",
            "category": "Wedding",
            "badge_text": "Our special day",
            "eyebrow_text": "Join us as we begin forever",
            "required_fields": [
                "event_name", "bride_name", "groom_name",
                "event_date_time", "event_location", "participant_name",
            ],
        },
    },
    {
        "name": "Corporate Sleek",
        "category": "Office",
        "thumbnail_url": "office/corporate.jpg",
        "design_schema": {
            "background_image": "office/corporate.jpg",
            "background_position": "center",
            "style_key": "office-corporate",
            "category": "Office",
            "badge_text": "Corporate event",
            "eyebrow_text": "Official invitation",
            "required_fields": [
                "event_name", "participant_name", "event_date_time", "event_location",
            ],
        },
    },
    {
        "name": "Tech Neon & Cyber",
        "category": "Office",
        "thumbnail_url": "office/tech.jpg",
        "design_schema": {
            "background_image": "office/tech.jpg",
            "background_position": "center",
            "style_key": "office-tech",
            "category": "Office",
            "badge_text": "Technology event",
            "eyebrow_text": "Innovation starts here",
            "required_fields": [
                "event_name", "participant_name", "event_date_time", "event_location",
            ],
        },
    },
    {
        "name": "Executive Earth-tones",
        "category": "Office",
        "thumbnail_url": "office/executive.jpg",
        "design_schema": {
            "background_image": "office/executive.jpg",
            "background_position": "center",
            "style_key": "office-executive",
            "category": "Office",
            "badge_text": "Executive gathering",
            "eyebrow_text": "Leadership • Vision • Growth",
            "required_fields": [
                "event_name", "participant_name", "event_date_time", "event_location",
            ],
        },
    },
    {
        "name": "Creative Geometric",
        "category": "Office",
        "thumbnail_url": "office/creative.jpg",
        "design_schema": {
            "background_image": "office/creative.jpg",
            "background_position": "center",
            "style_key": "office-creative",
            "category": "Office",
            "badge_text": "Creative session",
            "eyebrow_text": "Connect • Create • Collaborate",
            "required_fields": [
                "event_name", "participant_name", "event_date_time", "event_location",
            ],
        },
    },
    {
        "name": "Pop-Art Vibrant",
        "category": "Birthday",
        "thumbnail_url": "birthday/pop-art.jpg",
        "design_schema": {
            "background_image": "birthday/pop-art.jpg",
            "background_position": "center",
            "style_key": "birthday-pop",
            "category": "Birthday",
            "badge_text": "Birthday celebration",
            "eyebrow_text": "Let us celebrate",
            "required_fields": [
                "event_name", "birthday_person_name", "event_date_time",
                "event_location", "participant_name",
            ],
        },
    },
    {
        "name": "Dark Mode Neon",
        "category": "Birthday",
        "thumbnail_url": "birthday/dark-neon.jpg",
        "design_schema": {
            "background_image": "birthday/dark-neon.jpg",
            "background_position": "center",
            "style_key": "birthday-neon",
            "category": "Birthday",
            "badge_text": "Party mode on",
            "eyebrow_text": "A night to remember",
            "required_fields": [
                "event_name", "birthday_person_name", "event_date_time",
                "event_location", "participant_name",
            ],
        },
    },
    {
        "name": "Soft Watercolor",
        "category": "Birthday",
        "thumbnail_url": "birthday/watercolor.jpg",
        "design_schema": {
            "background_image": "birthday/watercolor.jpg",
            "background_position": "center",
            "style_key": "birthday-watercolor",
            "category": "Birthday",
            "badge_text": "A special birthday",
            "eyebrow_text": "Please join us to celebrate",
            "required_fields": [
                "event_name", "birthday_person_name", "event_date_time",
                "event_location", "participant_name",
            ],
        },
    },
    {
        "name": "Bold Retro",
        "category": "Birthday",
        "thumbnail_url": "birthday/retro.jpg",
        "design_schema": {
            "background_image": "birthday/retro.jpg",
            "background_position": "center",
            "style_key": "birthday-retro",
            "category": "Birthday",
            "badge_text": "Good vibes only",
            "eyebrow_text": "Come party with us",
            "required_fields": [
                "event_name", "birthday_person_name", "event_date_time",
                "event_location", "participant_name",
            ],
        },
    },
]


async def seed_templates(db: AsyncSession) -> None:
    """Create missing templates and update existing templates by template name."""
    result = await db.execute(select(Template))
    existing_templates = {
        template.name: template for template in result.scalars().all()
    }

    for template_data in TEMPLATES_DATA:
        existing = existing_templates.get(template_data["name"])

        if existing is not None:
            existing.category = template_data["category"]
            existing.thumbnail_url = template_data["thumbnail_url"]
            existing.design_schema = template_data["design_schema"]
            continue

        db.add(
            Template(
                id=uuid.uuid4(),
                name=template_data["name"],
                category=template_data["category"],
                thumbnail_url=template_data["thumbnail_url"],
                design_schema=template_data["design_schema"],
            )
        )

    await db.commit()
