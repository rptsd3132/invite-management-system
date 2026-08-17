import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.template import Template


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
    "event_date_time",
    "event_location",
    "participant_name",
]

OFFICE_FIELDS = [
    "event_name",
    "participant_name",
    "event_date_time",
    "event_location",
]


def text_pos(
    x: float,
    y: float,
    width: float,
    size: str,
    color: str,
    align: str = "center",
    family: str = "sans",
    weight: int = 500,
    letter_spacing: str = "0em",
    uppercase: bool = False,
    shadow: bool = True,
    value_part: str = "full",
    prefix: str = "",
    suffix: str = "",
) -> dict:
    return {
        "x": x,
        "y": y,
        "width": width,
        "size": size,
        "color": color,
        "align": align,
        "family": family,
        "weight": weight,
        "letter_spacing": letter_spacing,
        "uppercase": uppercase,
        "shadow": shadow,
        "value_part": value_part,
        "prefix": prefix,
        "suffix": suffix,
    }


def static_text(
    text: str,
    x: float,
    y: float,
    size: str,
    color: str,
    family: str = "serif",
    weight: int = 400,
    align: str = "center",
    shadow: bool = True,
) -> dict:
    return {
        "text": text,
        "x": x,
        "y": y,
        "width": 30,
        "size": size,
        "color": color,
        "family": family,
        "weight": weight,
        "align": align,
        "shadow": shadow,
    }


def make_template(
    name: str,
    category: str,
    image: str,
    style_key: str,
    required_fields: list[str],
    layout: dict[str, dict],
    static_texts: list[dict] | None = None,
    aspect_ratio: str = "1240 / 1748",
) -> dict:
    return {
        "name": name,
        "category": category,
        "thumbnail_url": image,
        "design_schema": {
            "background_image": image,
            "background_position": "center",
            "style_key": style_key,
            "category": category,
            "badge_text": None,
            "eyebrow_text": None,
            "required_fields": required_fields,
            "overlay_mode": "positioned",
            "aspect_ratio": aspect_ratio,
            "layout": layout,
            "static_texts": static_texts or [],
        },
    }


TEMPLATES_DATA = [
    # =========================================================
    # WEDDING — individually fitted to original artwork
    # =========================================================

    make_template(
        "Wedding Floral Classic",
        "Wedding",
        "wedding/1.png",
        "wedding-botanical",
        WEDDING_FIELDS,
        {
            "bride_name": text_pos(
                50, 31, 58, "hero", "#F6DA84",
                family="serif", weight=600,
            ),
            "groom_name": text_pos(
                50, 51, 58, "hero", "#F6DA84",
                family="serif", weight=600,
            ),
            "event_date_time": text_pos(
                50, 68, 58, "xs", "#F8E7B0",
                family="sans", weight=600,
            ),
            "event_location": text_pos(
                50, 75, 60, "xs", "#F8E7B0",
                family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 85, 56, "sm", "#FFFFFF",
                family="serif", weight=600,
            ),
        },
    ),

    make_template(
        "Wedding Elegant Classic",
        "Wedding",
        "wedding/2.png",
        "wedding-minimal",
        WEDDING_FIELDS,
        {
            "bride_name": text_pos(
                50, 29, 54, "xl", "#1E3B6E",
                family="serif", weight=600, shadow=False,
            ),
            "groom_name": text_pos(
                50, 46, 54, "xl", "#1E3B6E",
                family="serif", weight=600, shadow=False,
            ),
            "event_date_time": text_pos(
                50, 65, 56, "xs", "#334E73",
                family="sans", weight=600, shadow=False,
            ),
            "event_location": text_pos(
                50, 71, 58, "xs", "#334E73",
                family="sans", weight=500, shadow=False,
            ),
            "participant_name": text_pos(
                50, 86, 54, "sm", "#1E3B6E",
                family="serif", weight=600, shadow=False,
            ),
        },
    ),

    make_template(
        "Wedding Modern Classic",
        "Wedding",
        "wedding/3.png",
        "wedding-pastel",
        WEDDING_FIELDS,
        {
            "event_name": text_pos(
                50, 31, 54, "xs", "#9A7567",
                family="sans", weight=600,
                uppercase=True, letter_spacing="0.12em", shadow=False,
            ),
            "bride_name": text_pos(
                50, 43, 52, "xl", "#7D5547",
                family="serif", weight=600, shadow=False,
            ),
            "groom_name": text_pos(
                50, 55, 52, "xl", "#7D5547",
                family="serif", weight=600, shadow=False,
            ),
            "event_date_time": text_pos(
                50, 66, 56, "xs", "#8A675A",
                family="sans", weight=600, shadow=False,
            ),
            "event_location": text_pos(
                50, 72, 58, "xs", "#8A675A",
                family="sans", weight=500, shadow=False,
            ),
            "participant_name": text_pos(
                50, 82, 54, "sm", "#7D5547",
                family="serif", weight=600, shadow=False,
            ),
        },
        static_texts=[
            static_text("&", 50, 49, "sm", "#B78E7D", shadow=False)
        ],
    ),

    make_template(
        "Black and Gold Elegant Wedding",
        "Wedding",
        "wedding/Black and Gold Elegant Simple Wedding Invitation.png",
        "wedding-luxury",
        WEDDING_FIELDS,
        {
            "bride_name": text_pos(
                50, 34, 54, "xl", "#F3D67A",
                family="serif", weight=600,
            ),
            "groom_name": text_pos(
                50, 53, 54, "xl", "#F3D67A",
                family="serif", weight=600,
            ),
            "event_date_time": text_pos(
                31, 66.5, 31, "xs", "#F5DD91",
                family="sans", weight=600,
            ),
            "event_location": text_pos(
                69, 66.5, 31, "xs", "#F5DD91",
                family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 78.5, 50, "sm", "#FFFFFF",
                family="serif", weight=600,
            ),
        },
    ),

    make_template(
        "Blue Elegant Wedding",
        "Wedding",
        "wedding/Blue Elegant Wedding Invitation.png",
        "wedding-minimal",
        WEDDING_FIELDS,
        {
            "event_name": text_pos(
                24, 25, 35, "xs", "#EDE580",
                align="left", family="sans", weight=600,
                uppercase=True, letter_spacing="0.10em",
            ),
            "bride_name": text_pos(
                50, 46, 28, "md", "#FFF2B3",
                family="serif", weight=700,
            ),
            "groom_name": text_pos(
                50, 54, 28, "md", "#FFF2B3",
                family="serif", weight=700,
            ),
            "event_date_time": text_pos(
                70, 65, 43, "xs", "#FFFFFF",
                align="right", family="sans", weight=600,
            ),
            "event_location": text_pos(
                70, 72, 43, "xs", "#FFFFFF",
                align="right", family="sans", weight=500,
            ),
            "participant_name": text_pos(
                70, 82, 40, "sm", "#EDE580",
                align="right", family="serif", weight=600,
            ),
        },
    ),

    make_template(
        "Blue Gold Elegant Wedding",
        "Wedding",
        "wedding/Blue Gold Elegant Wedding Invitation.png",
        "wedding-luxury",
        WEDDING_FIELDS,
        {
            "bride_name": text_pos(
                50, 53, 54, "xl", "#F5D77C",
                family="serif", weight=600,
            ),
            "groom_name": text_pos(
                50, 62, 54, "xl", "#F5D77C",
                family="serif", weight=600,
            ),
            "event_date_time": text_pos(
                46, 74, 37, "xs", "#FFFFFF",
                align="right", family="sans", weight=600,
            ),
            "event_location": text_pos(
                54, 74, 37, "xs", "#FFFFFF",
                align="left", family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 86, 52, "sm", "#E8CC6B",
                family="sans", weight=700,
            ),
        },
        static_texts=[
            static_text("&", 50, 57.5, "xs", "#DDBD63")
        ],
    ),

    make_template(
        "Green and White Wedding",
        "Wedding",
        "wedding/Green and White Wedding Invitation Announcement .png",
        "wedding-botanical",
        WEDDING_FIELDS,
        {
            "bride_name": text_pos(
                50, 45, 43, "xl", "#FFF9E7",
                family="serif", weight=600,
            ),
            "groom_name": text_pos(
                50, 55, 43, "xl", "#FFF9E7",
                family="serif", weight=600,
            ),
            "event_date_time": text_pos(
                50, 66, 48, "xs", "#FFFBEF",
                family="sans", weight=600,
            ),
            "event_location": text_pos(
                50, 72, 50, "xs", "#FFFBEF",
                family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 82, 46, "sm", "#FFF7DD",
                family="serif", weight=600,
            ),
        },
        static_texts=[
            static_text("&", 50, 50, "xs", "#FFF0C0")
        ],
    ),

    make_template(
        "Blue and Gold Modern Wedding",
        "Wedding",
        "wedding/_Blue and Gold Modern Birthday Party Invitation.png",
        "wedding-luxury",
        WEDDING_FIELDS,
        {
            "event_name": text_pos(
                50, 23, 56, "xs", "#E7D37F",
                family="sans", weight=600,
                uppercase=True, letter_spacing="0.12em",
            ),
            "bride_name": text_pos(
                50, 42, 52, "xl", "#F2DE91",
                family="serif", weight=600,
            ),
            "groom_name": text_pos(
                50, 53, 52, "xl", "#F2DE91",
                family="serif", weight=600,
            ),
            "event_date_time": text_pos(
                45, 74, 36, "xs", "#FFFFFF",
                align="right", family="sans", weight=600,
            ),
            "event_location": text_pos(
                55, 74, 36, "xs", "#FFFFFF",
                align="left", family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 85, 50, "sm", "#E7D37F",
                family="sans", weight=700,
            ),
        },
        static_texts=[
            static_text("&", 50, 47.5, "xs", "#D9BF65")
        ],
    ),

    # =========================================================
    # BIRTHDAY — fitted to printed titles, ribbons and rules
    # =========================================================

    make_template(
        "Black and Gold Birthday Card",
        "Birthday",
        "birthday/Black And Gold Modern Birthday Party Card.png",
        "birthday-neon",
        BIRTHDAY_FIELDS,
        {
            "birthday_person_name": text_pos(
                50, 60, 54, "lg", "#F5C86B",
                family="serif", weight=700,
            ),
            "event_date_time": text_pos(
                45, 72, 34, "xs", "#F6D995",
                align="right", family="sans", weight=600,
            ),
            "event_location": text_pos(
                55, 72, 34, "xs", "#F6D995",
                align="left", family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 86, 48, "sm", "#FFFFFF",
                family="sans", weight=700,
            ),
        },
        aspect_ratio="1 / 1",
    ),

    make_template(
        "Black and Gold Modern Birthday",
        "Birthday",
        "birthday/Black And Gold Modern Birthday Party Invitation Portrait.png",
        "birthday-neon",
        BIRTHDAY_FIELDS,
        {
            "birthday_person_name": text_pos(
                50, 58, 50, "lg", "#F6B6AE",
                family="serif", weight=700,
            ),
            "event_date_time": text_pos(
                46, 69, 34, "xs", "#FFFFFF",
                align="right", family="sans", weight=600,
            ),
            "event_location": text_pos(
                54, 69, 34, "xs", "#FFFFFF",
                align="left", family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 82, 48, "sm", "#F6D2C9",
                family="sans", weight=700,
            ),
        },
    ),

    make_template(
        "Black Gold Elegant Birthday",
        "Birthday",
        "birthday/Black and Gold Elegant Birthday Party Invitation.png",
        "birthday-retro",
        BIRTHDAY_FIELDS,
        {
            "birthday_person_name": text_pos(
                50, 45.5, 50, "lg", "#F7C64F",
                family="serif", weight=700,
            ),
            "event_date_time": text_pos(
                45, 55.5, 34, "xs", "#F1D788",
                align="right", family="sans", weight=600,
            ),
            "event_location": text_pos(
                55, 55.5, 34, "xs", "#F1D788",
                align="left", family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 68, 48, "sm", "#FFFFFF",
                family="sans", weight=700,
            ),
        },
        aspect_ratio="1 / 1",
    ),

    make_template(
        "Black Yellow Elegant Birthday",
        "Birthday",
        "birthday/Black and Yellow Elegant Birthday Party Invitation.png",
        "birthday-pop",
        BIRTHDAY_FIELDS,
        {
            "birthday_person_name": text_pos(
                50, 40.5, 45, "md", "#23160A",
                family="serif", weight=800, shadow=False,
            ),
            "event_date_time__date": text_pos(
                50, 66, 42, "xs", "#F6D76E",
                family="sans", weight=600,
                value_part="date",
            ),
            "event_date_time__time": text_pos(
                50, 70, 38, "xs", "#F6D76E",
                family="sans", weight=600,
                value_part="time",
            ),
            "event_location": text_pos(
                50, 76, 54, "xs", "#FFF1B6",
                family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 84, 48, "sm", "#FFFFFF",
                family="sans", weight=700,
            ),
        },
    ),

    make_template(
        "Blue Gold Modern Birthday",
        "Birthday",
        "birthday/Blue and Gold Modern Birthday Party Invitation.png",
        "birthday-pop",
        BIRTHDAY_FIELDS,
        {
            "birthday_person_name": text_pos(
                50, 59, 50, "lg", "#E9D59A",
                family="serif", weight=700,
            ),
            "event_date_time": text_pos(
                45, 69, 34, "xs", "#FFFFFF",
                align="right", family="sans", weight=600,
            ),
            "event_location": text_pos(
                55, 69, 34, "xs", "#FFFFFF",
                align="left", family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 80, 45, "sm", "#E9D59A",
                family="sans", weight=700,
            ),
        },
    ),

    make_template(
        "Blue Gold Vintage Birthday",
        "Birthday",
        "birthday/Blue and Gold Vintage Birthday Invitation.png",
        "birthday-retro",
        BIRTHDAY_FIELDS,
        {
            "birthday_person_name": text_pos(
                50, 57, 50, "lg", "#F0D27B",
                family="serif", weight=700,
            ),
            "event_date_time": text_pos(
                50, 68, 54, "xs", "#FFFFFF",
                family="sans", weight=600,
            ),
            "event_location": text_pos(
                50, 75, 56, "xs", "#FFFFFF",
                family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 86, 48, "sm", "#F0D27B",
                family="sans", weight=700,
            ),
        },
        aspect_ratio="1 / 1",
    ),

    make_template(
        "Brown Beige Retro Birthday",
        "Birthday",
        "birthday/Brown Beige and Yellow Retro Birthday Party Invitation.png",
        "birthday-watercolor",
        BIRTHDAY_FIELDS,
        {
            "birthday_person_name": text_pos(
                31, 65, 40, "md", "#6F452F",
                family="serif", weight=700, shadow=False,
            ),
            "event_date_time": text_pos(
                31, 72, 39, "xs", "#6F452F",
                family="sans", weight=600, shadow=False,
            ),
            "event_location": text_pos(
                31, 78, 39, "xs", "#6F452F",
                family="sans", weight=500, shadow=False,
            ),
            "participant_name": text_pos(
                31, 86, 39, "xs", "#8E5736",
                family="sans", weight=700, shadow=False,
            ),
        },
    ),

    make_template(
        "Blue Gold Party Birthday",
        "Birthday",
        "birthday/_Blue and Gold Modern Birthday Party Invitation.png",
        "birthday-neon",
        BIRTHDAY_FIELDS,
        {
            "event_name": text_pos(
                50, 24, 54, "xs", "#E7D37F",
                family="sans", weight=600,
                uppercase=True, letter_spacing="0.10em",
            ),
            "birthday_person_name": text_pos(
                50, 43, 48, "lg", "#F2DE91",
                family="serif", weight=700,
            ),
            "event_date_time": text_pos(
                45, 73.5, 34, "xs", "#FFFFFF",
                align="right", family="sans", weight=600,
            ),
            "event_location": text_pos(
                55, 73.5, 34, "xs", "#FFFFFF",
                align="left", family="sans", weight=500,
            ),
            "participant_name": text_pos(
                50, 85, 46, "sm", "#E7D37F",
                family="sans", weight=700,
            ),
        },
    ),

    # =========================================================
    # OFFICE — individually fitted to guides/icons/illustrations
    # =========================================================

    make_template(
        "Modern Virtual Learning Event",
        "Office",
        "office/Black and White Modern Virtual Learning Event Flyer (A4).png",
        "office-corporate",
        OFFICE_FIELDS,
        {
            "event_name": text_pos(
                8, 55, 54, "md", "#FFFFFF",
                align="left", family="sans", weight=800,
            ),
            "participant_name": text_pos(
                8, 64, 50, "xs", "#E6E8EB",
                align="left", family="sans", weight=700,
                uppercase=True, letter_spacing="0.08em",
            ),
            "event_date_time": text_pos(
                8, 73, 50, "xs", "#FFFFFF",
                align="left", family="sans", weight=600,
            ),
            "event_location": text_pos(
                8, 80, 50, "xs", "#FFFFFF",
                align="left", family="sans", weight=500,
            ),
        },
        aspect_ratio="1414 / 2000",
    ),

    make_template(
        "Blue Black Virtual Meeting",
        "Office",
        "office/Blue Black Simple Modern Meeting Virtual Invitation.png",
        "office-tech",
        OFFICE_FIELDS,
        {
            "event_name": text_pos(
                50, 18, 64, "md", "#123F75",
                family="sans", weight=800, shadow=False,
            ),
            "participant_name": text_pos(
                50, 28, 52, "xs", "#355A7E",
                family="sans", weight=700,
                uppercase=True, letter_spacing="0.10em", shadow=False,
            ),
            "event_date_time": text_pos(
                50, 37, 56, "xs", "#183B5C",
                family="sans", weight=600, shadow=False,
            ),
            "event_location": text_pos(
                50, 44, 58, "xs", "#183B5C",
                family="sans", weight=500, shadow=False,
            ),
        },
    ),

    make_template(
        "Blue Gradient Monthly Meeting",
        "Office",
        "office/Blue Gradient Modern Monthly Meeting Invitation.png",
        "office-tech",
        OFFICE_FIELDS,
        {
            "event_name": text_pos(
                50, 14.5, 60, "md", "#0C4FA3",
                family="sans", weight=800, shadow=False,
            ),
            "participant_name": text_pos(
                50, 24, 50, "xs", "#2C5F91",
                family="sans", weight=700,
                uppercase=True, letter_spacing="0.10em", shadow=False,
            ),
            "event_date_time": text_pos(
                50, 32, 54, "xs", "#174F8B",
                family="sans", weight=600, shadow=False,
            ),
            "event_location": text_pos(
                50, 37.5, 56, "xs", "#174F8B",
                family="sans", weight=500, shadow=False,
            ),
        },
    ),

    make_template(
        "Blue Gray Elegant Meeting",
        "Office",
        "office/Blue Gray Minimalist Elegant Meeting Virtual Invitation.png",
        "office-executive",
        OFFICE_FIELDS,
        {
            "event_name": text_pos(
                50, 14.5, 62, "md", "#1F4E78",
                family="sans", weight=800, shadow=False,
            ),
            "participant_name": text_pos(
                50, 24, 50, "xs", "#53718A",
                family="sans", weight=700,
                uppercase=True, letter_spacing="0.10em", shadow=False,
            ),
            "event_date_time": text_pos(
                50, 32, 54, "xs", "#1F4E78",
                family="sans", weight=600, shadow=False,
            ),
            "event_location": text_pos(
                50, 38, 56, "xs", "#1F4E78",
                family="sans", weight=500, shadow=False,
            ),
        },
    ),

    # This template has built-in calendar / clock / phone icons.
    # We use calendar for date and clock for time, then place location
    # on the clean line below instead of incorrectly beside the phone icon.
    make_template(
        "Blue White Online Meeting",
        "Office",
        "office/Blue White Modern Simple Meeting Online Invitation Virtual .png",
        "office-corporate",
        OFFICE_FIELDS,
        {
            "event_name": text_pos(
                50, 55, 60, "md", "#0B4E7E",
                family="sans", weight=800, shadow=False,
            ),
            "participant_name": text_pos(
                50, 59.5, 48, "xs", "#326A8C",
                family="sans", weight=700,
                uppercase=True, letter_spacing="0.10em", shadow=False,
            ),
            "event_date_time__date": text_pos(
                38, 63.2, 49, "xs", "#164B6B",
                align="left", family="sans", weight=600,
                value_part="date", shadow=False,
            ),
            "event_date_time__time": text_pos(
                38, 68.8, 35, "xs", "#164B6B",
                align="left", family="sans", weight=600,
                value_part="time", shadow=False,
            ),
            "event_location": text_pos(
                50, 78.5, 58, "xs", "#164B6B",
                family="sans", weight=500, shadow=False,
            ),
        },
    ),

    # This template has printed calendar and location icons.
    make_template(
        "Blue White Modern Meeting",
        "Office",
        "office/Blue and White Modern Meeting Invitation Virtual Invitation.png",
        "office-corporate",
        OFFICE_FIELDS,
        {
            "event_name": text_pos(
                50, 29, 60, "md", "#0B4C83",
                family="sans", weight=800, shadow=False,
            ),
            "participant_name": text_pos(
                50, 36.5, 46, "xs", "#416C91",
                family="sans", weight=700,
                uppercase=True, letter_spacing="0.10em", shadow=False,
            ),
            "event_date_time": text_pos(
                49, 45.5, 43, "xs", "#164B6B",
                align="left", family="sans", weight=600, shadow=False,
            ),
            "event_location": text_pos(
                49, 52.5, 43, "xs", "#164B6B",
                align="left", family="sans", weight=500, shadow=False,
            ),
        },
    ),

    make_template(
        "Purple Blue Business Meeting",
        "Office",
        "office/Purple Blue Modern Business Meeting Invitation.png",
        "office-creative",
        OFFICE_FIELDS,
        {
            "event_name": text_pos(
                50, 14, 62, "md", "#392A80",
                family="sans", weight=800, shadow=False,
            ),
            "participant_name": text_pos(
                50, 23.5, 50, "xs", "#5A4A92",
                family="sans", weight=700,
                uppercase=True, letter_spacing="0.10em", shadow=False,
            ),
            "event_date_time": text_pos(
                50, 31.5, 54, "xs", "#4C3D79",
                family="sans", weight=600, shadow=False,
            ),
            "event_location": text_pos(
                50, 37.5, 56, "xs", "#4C3D79",
                family="sans", weight=500, shadow=False,
            ),
        },
    ),

    make_template(
        "White Blue Company Meeting",
        "Office",
        "office/White Blue Bold Minimalist Company Meeting Invitation.png",
        "office-executive",
        OFFICE_FIELDS,
        {
            "event_name": text_pos(
                57, 37, 62, "md", "#FFFFFF",
                family="sans", weight=800,
            ),
            "participant_name": text_pos(
                57, 47, 48, "xs", "#C9E6F6",
                family="sans", weight=700,
                uppercase=True, letter_spacing="0.10em",
            ),
            "event_date_time": text_pos(
                57, 57, 54, "xs", "#FFFFFF",
                family="sans", weight=600,
            ),
            "event_location": text_pos(
                57, 65, 56, "xs", "#FFFFFF",
                family="sans", weight=500,
            ),
        },
    ),
]


async def seed_templates(db: AsyncSession) -> None:
    """Create missing templates and update existing templates by template name."""

    result = await db.execute(select(Template))

    existing_templates = {
        template.name: template
        for template in result.scalars().all()
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