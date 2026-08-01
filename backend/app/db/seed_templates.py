import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.template import Template

TEMPLATES_DATA = [
    # ── WEDDING (4) ──────────────────────────────────────────────────────
    {
        "name": "Arch Botanical",
        "category": "Wedding",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-b from-emerald-50 via-green-50 to-stone-50",
            "decorations": [
                "leaf-top-right",
                "leaf-bottom-left",
                "gold-frame",
            ],
            "typography": {
                "title_classes": "font-serif text-3xl text-emerald-800 mb-1 z-10",
                "accent_classes": "font-serif italic text-lg text-emerald-600 my-1 z-10",
                "body_classes": "font-sans text-xs text-stone-500 uppercase tracking-[0.2em] z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time",
                "participant_name", "bride_name", "groom_name",
            ],
        },
    },
    {
        "name": "Minimalist Typography",
        "category": "Wedding",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-xl flex flex-col items-center text-center overflow-hidden bg-white",
            "background": "bg-white",
            "decorations": [
                "gold-frame",
            ],
            "typography": {
                "title_classes": "font-sans text-4xl text-stone-800 font-light tracking-tight z-10",
                "accent_classes": "font-sans text-xs text-stone-400 uppercase tracking-[0.35em] my-1 z-10",
                "body_classes": "font-sans text-sm text-stone-600 leading-relaxed z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time",
                "participant_name", "bride_name", "groom_name",
            ],
        },
    },
    {
        "name": "Elegant Gold & Navy",
        "category": "Wedding",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900",
            "decorations": [
                "gold-frame",
                "inner-gold-frame",
            ],
            "typography": {
                "title_classes": "font-serif text-4xl text-amber-300 mb-1 tracking-wide z-10",
                "accent_classes": "font-sans text-xs text-amber-400/80 uppercase tracking-[0.3em] my-1 z-10",
                "body_classes": "font-sans text-sm text-slate-300 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time",
                "participant_name", "bride_name", "groom_name",
            ],
        },
    },
    {
        "name": "Whimsical Pastel",
        "category": "Wedding",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-tr from-pink-100 via-purple-50 to-sky-100",
            "decorations": [
                "pink-flower-top-left",
                "purple-flower-bottom-right",
                "top-pink-circle",
            ],
            "typography": {
                "title_classes": "font-serif text-3xl text-purple-700 mb-1 z-10",
                "accent_classes": "font-serif italic text-lg text-pink-500 my-1 z-10",
                "body_classes": "font-sans text-xs text-stone-500 uppercase tracking-[0.15em] z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time",
                "participant_name", "bride_name", "groom_name",
            ],
        },
    },
    # ── OFFICE (4) ───────────────────────────────────────────────────────
    {
        "name": "Corporate Sleek",
        "category": "Office",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50",
            "decorations": [
                "gold-frame",
            ],
            "typography": {
                "title_classes": "font-sans text-3xl text-slate-800 font-bold tracking-tight z-10",
                "accent_classes": "font-sans text-xs text-blue-500 uppercase tracking-[0.3em] mb-2 z-10",
                "body_classes": "font-sans text-sm text-slate-600 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time", "participant_name",
            ],
        },
    },
    {
        "name": "Tech Neon & Cyber",
        "category": "Office",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950",
            "decorations": [
                "gold-frame",
                "inner-gold-frame",
            ],
            "typography": {
                "title_classes": "font-mono text-3xl text-cyan-300 font-bold tracking-wide z-10",
                "accent_classes": "font-sans text-xs text-fuchsia-400 uppercase tracking-[0.35em] mb-2 z-10",
                "body_classes": "font-sans text-sm text-slate-300 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time", "participant_name",
            ],
        },
    },
    {
        "name": "Executive Earth-tones",
        "category": "Office",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50",
            "decorations": [
                "gold-frame",
            ],
            "typography": {
                "title_classes": "font-serif text-3xl text-amber-900 font-semibold z-10",
                "accent_classes": "font-sans text-xs text-stone-500 uppercase tracking-[0.3em] mb-2 z-10",
                "body_classes": "font-sans text-sm text-stone-600 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time", "participant_name",
            ],
        },
    },
    {
        "name": "Creative Geometric",
        "category": "Office",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50",
            "decorations": [
                "top-pink-circle",
                "bottom-purple-circle",
            ],
            "typography": {
                "title_classes": "font-sans text-3xl text-indigo-700 font-black tracking-tight z-10",
                "accent_classes": "font-sans text-xs text-fuchsia-500 uppercase tracking-[0.3em] mb-2 z-10",
                "body_classes": "font-sans text-sm text-stone-600 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time", "participant_name",
            ],
        },
    },
    # ── BIRTHDAY (4) ─────────────────────────────────────────────────────
    {
        "name": "Pop-Art Vibrant",
        "category": "Birthday",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400",
            "decorations": [
                "confetti",
                "top-pink-circle",
                "bottom-purple-circle",
            ],
            "typography": {
                "title_classes": "font-sans text-4xl text-white font-black tracking-tight uppercase z-10",
                "accent_classes": "font-sans text-sm text-yellow-200 uppercase tracking-[0.35em] font-bold z-10",
                "body_classes": "font-sans text-sm text-white/90 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time",
                "participant_name", "birthday_person_name",
            ],
        },
    },
    {
        "name": "Dark Mode Neon",
        "category": "Birthday",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-b from-gray-900 via-zinc-900 to-gray-900",
            "decorations": [
                "confetti",
                "top-pink-circle",
                "bottom-purple-circle",
            ],
            "typography": {
                "title_classes": "font-sans text-4xl text-pink-400 font-black tracking-tight z-10 drop-shadow-[0_0_12px_rgba(236,72,153,0.3)]",
                "accent_classes": "font-sans text-sm text-cyan-300 uppercase tracking-[0.35em] z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]",
                "body_classes": "font-sans text-sm text-zinc-300 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time",
                "participant_name", "birthday_person_name",
            ],
        },
    },
    {
        "name": "Soft Watercolor",
        "category": "Birthday",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-br from-sky-100 via-rose-50 to-amber-50",
            "decorations": [
                "confetti",
                "top-pink-circle",
                "bottom-purple-circle",
            ],
            "typography": {
                "title_classes": "font-serif text-3xl text-rose-500 mb-1 z-10",
                "accent_classes": "font-sans text-xs text-sky-600 uppercase tracking-[0.3em] mb-2 z-10",
                "body_classes": "font-sans text-sm text-stone-500 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time",
                "participant_name", "birthday_person_name",
            ],
        },
    },
    {
        "name": "Bold Retro",
        "category": "Birthday",
        "design_schema": {
            "container_classes": "relative w-full max-w-md mx-auto aspect-[3/4] shadow-2xl flex flex-col items-center text-center overflow-hidden",
            "background": "bg-gradient-to-b from-orange-200 via-yellow-100 to-orange-100",
            "decorations": [
                "confetti",
                "top-pink-circle",
                "bottom-purple-circle",
            ],
            "typography": {
                "title_classes": "font-sans text-4xl text-orange-700 font-black tracking-tight uppercase z-10",
                "accent_classes": "font-sans text-sm text-orange-500 uppercase tracking-[0.3em] font-bold z-10",
                "body_classes": "font-sans text-sm text-stone-600 z-10",
            },
            "required_fields": [
                "event_name", "event_location", "event_date_time",
                "participant_name", "birthday_person_name",
            ],
        },
    },
]


async def seed_templates(db: AsyncSession) -> None:
    result = await db.execute(select(Template).limit(1))
    if result.scalar_one_or_none() is not None:
        return

    for tpl in TEMPLATES_DATA:
        template = Template(
            id=uuid.uuid4(),
            name=tpl["name"],
            category=tpl["category"],
            thumbnail_url=None,
            design_schema=tpl["design_schema"],
        )
        db.add(template)

    await db.commit()
