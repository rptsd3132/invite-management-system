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
                "absolute inset-0 border-[12px] border-emerald-200/40 rounded-t-full",
                "absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-100/30 rounded-b-full",
                "absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-100/40 to-transparent",
                "absolute top-4 left-4 w-6 h-6 border-2 border-emerald-300/50 rounded-full",
                "absolute top-4 right-4 w-6 h-6 border-2 border-emerald-300/50 rounded-full",
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
                "absolute inset-6 border border-stone-200",
                "absolute top-8 left-1/2 -translate-x-1/2 w-12 h-px bg-stone-300",
                "absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-px bg-stone-300",
                "absolute top-1/3 right-8 w-2 h-2 rounded-full bg-stone-200",
                "absolute bottom-1/3 left-8 w-2 h-2 rounded-full bg-stone-200",
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
                "absolute inset-3 border border-amber-400/30 rounded-sm",
                "absolute top-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent",
                "absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent",
                "absolute top-1/3 left-8 w-3 h-3 border border-amber-400/40 rotate-45",
                "absolute bottom-1/3 right-8 w-3 h-3 border border-amber-400/40 rotate-45",
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
                "absolute -top-4 -left-4 w-20 h-20 rounded-full bg-pink-200/40",
                "absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-purple-200/40",
                "absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 rounded-full bg-sky-200/60",
                "absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 rounded-full bg-pink-200/60",
                "absolute top-6 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-pink-200 via-purple-200 to-sky-200",
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
                "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-sky-400",
                "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-400",
                "absolute inset-8 border border-slate-200",
                "absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 border border-blue-200 rounded-full",
                "absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-px bg-slate-200",
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
                "absolute inset-0 border border-cyan-400/20",
                "absolute inset-2 border border-fuchsia-400/10",
                "absolute top-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent",
                "absolute bottom-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent",
                "absolute top-1/2 left-4 w-3 h-3 border border-cyan-400/50 rotate-12",
                "absolute bottom-1/3 right-4 w-3 h-3 border border-fuchsia-400/50 -rotate-12",
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
                "absolute top-0 left-0 w-1/3 h-1 bg-gradient-to-r from-amber-500 to-orange-400",
                "absolute bottom-0 right-0 w-1/2 h-1 bg-gradient-to-l from-amber-500 to-orange-400",
                "absolute top-6 right-6 w-16 h-16 border border-amber-200/60 rounded-sm",
                "absolute bottom-6 left-6 w-16 h-16 border border-amber-200/60 rounded-sm",
                "absolute inset-10 border border-stone-100",
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
                "absolute -top-8 -right-8 w-32 h-32 bg-violet-200/30 -rotate-12",
                "absolute -bottom-8 -left-8 w-32 h-32 bg-fuchsia-200/30 rotate-12",
                "absolute top-12 left-8 w-4 h-4 border-2 border-indigo-300/60 rotate-45",
                "absolute bottom-12 right-8 w-4 h-4 border-2 border-fuchsia-300/60 rotate-45",
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-violet-200/40 rotate-45",
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
                "absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.2)_0%,transparent_50%)]",
                "absolute top-3 left-3 w-8 h-8 bg-yellow-200 rounded-full opacity-60",
                "absolute top-3 right-3 w-6 h-6 bg-white rounded-full opacity-40",
                "absolute bottom-3 left-3 w-6 h-6 bg-orange-200 rounded-full opacity-50",
                "absolute bottom-3 right-3 w-8 h-8 bg-yellow-200 rounded-full opacity-60",
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
                "absolute inset-0 border-2 border-pink-500/20 rounded-3xl",
                "absolute inset-3 border border-cyan-400/10 rounded-2xl",
                "absolute top-6 left-6 w-4 h-4 rounded-full bg-pink-500/30 shadow-lg shadow-pink-500/20",
                "absolute top-6 right-6 w-4 h-4 rounded-full bg-cyan-400/30 shadow-lg shadow-cyan-400/20",
                "absolute bottom-6 left-6 w-4 h-4 rounded-full bg-cyan-400/30 shadow-lg shadow-cyan-400/20",
                "absolute bottom-6 right-6 w-4 h-4 rounded-full bg-pink-500/30 shadow-lg shadow-pink-500/20",
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
                "absolute -top-12 -right-12 w-40 h-40 rounded-full bg-sky-200/30",
                "absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-rose-200/30",
                "absolute top-1/3 -left-6 w-16 h-16 rounded-full bg-amber-100/40",
                "absolute bottom-1/3 -right-6 w-16 h-16 rounded-full bg-sky-100/40",
                "absolute inset-4 border border-white/60 rounded-2xl",
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
                "absolute inset-0 border-[16px] border-orange-300/50",
                "absolute inset-2 border-2 border-yellow-400/30 border-dashed rounded-sm",
                "absolute top-8 left-1/2 -translate-x-1/2 w-20 h-1 bg-orange-300/60",
                "absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-1 bg-orange-300/60",
                "absolute top-12 right-8 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] w-5 h-5 bg-orange-400/40",
                "absolute bottom-12 left-8 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] w-5 h-5 bg-orange-400/40",
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
