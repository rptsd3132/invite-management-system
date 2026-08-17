export type TemplateStyleKey =
  | "wedding-botanical"
  | "wedding-minimal"
  | "wedding-luxury"
  | "wedding-pastel"
  | "office-corporate"
  | "office-tech"
  | "office-executive"
  | "office-creative"
  | "birthday-pop"
  | "birthday-neon"
  | "birthday-watercolor"
  | "birthday-retro";

export interface TemplateVisualStyle {
  root: string;
  overlay: string;
  panel: string;
  frameOuter: string;
  frameInner: string;
  label: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  divider: string;
  alignment: string;
  decoration: "floral" | "sparkle" | "confetti" | "geometry" | "none";
}

export const TEMPLATE_STYLES: Record<TemplateStyleKey, TemplateVisualStyle> = {
  "wedding-botanical": {
    root: "bg-emerald-950",
    overlay: "bg-gradient-to-b from-emerald-950/15 via-emerald-950/10 to-emerald-950/70",
    panel: "border border-white/35 bg-white/15 text-white shadow-[0_24px_80px_rgba(6,78,59,0.28)] backdrop-blur-md",
    frameOuter: "border border-amber-100/70",
    frameInner: "border border-white/25",
    label: "border border-amber-100/40 bg-emerald-950/35 text-amber-50 backdrop-blur-md",
    eyebrow: "text-amber-50/85",
    title: "font-serif text-[clamp(1.65rem,5vw,2.4rem)] font-semibold leading-tight text-white",
    accent: "font-serif text-[clamp(1.45rem,4.5vw,2.1rem)] italic leading-tight text-amber-100",
    body: "text-[clamp(0.68rem,2.3vw,0.88rem)] font-medium uppercase tracking-[0.18em] text-white/85",
    divider: "bg-amber-100/55",
    alignment: "items-center justify-center text-center",
    decoration: "floral",
  },
  "wedding-minimal": {
    root: "bg-stone-100",
    overlay: "bg-gradient-to-b from-white/5 via-white/20 to-stone-950/15",
    panel: "border border-stone-900/10 bg-white/78 text-stone-900 shadow-[0_24px_70px_rgba(41,37,36,0.18)] backdrop-blur-sm",
    frameOuter: "border border-stone-800/30",
    frameInner: "border border-white/70",
    label: "border border-stone-900/10 bg-white/75 text-stone-700 backdrop-blur-md",
    eyebrow: "text-stone-500",
    title: "font-serif text-[clamp(1.65rem,5vw,2.35rem)] font-medium leading-tight text-stone-900",
    accent: "font-serif text-[clamp(1.35rem,4.5vw,2rem)] italic leading-tight text-stone-700",
    body: "text-[clamp(0.68rem,2.3vw,0.86rem)] uppercase tracking-[0.19em] text-stone-600",
    divider: "bg-stone-700/35",
    alignment: "items-center justify-center text-center",
    decoration: "none",
  },
  "wedding-luxury": {
    root: "bg-slate-950",
    overlay: "bg-gradient-to-b from-slate-950/25 via-slate-950/15 to-slate-950/80",
    panel: "border border-amber-200/25 bg-slate-950/45 text-white shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-md",
    frameOuter: "border border-amber-300/70",
    frameInner: "border border-amber-100/25",
    label: "border border-amber-300/35 bg-slate-950/45 text-amber-100 backdrop-blur-md",
    eyebrow: "text-amber-200/85",
    title: "font-serif text-[clamp(1.7rem,5.2vw,2.5rem)] font-semibold leading-tight text-amber-100",
    accent: "font-serif text-[clamp(1.45rem,4.7vw,2.15rem)] italic leading-tight text-white",
    body: "text-[clamp(0.68rem,2.3vw,0.88rem)] uppercase tracking-[0.19em] text-slate-200",
    divider: "bg-amber-200/55",
    alignment: "items-center justify-center text-center",
    decoration: "sparkle",
  },
  "wedding-pastel": {
    root: "bg-rose-100",
    overlay: "bg-gradient-to-b from-white/5 via-rose-50/10 to-purple-950/30",
    panel: "border border-white/55 bg-white/52 text-purple-950 shadow-[0_24px_80px_rgba(147,51,234,0.18)] backdrop-blur-md",
    frameOuter: "border border-white/65",
    frameInner: "border border-rose-200/55",
    label: "border border-white/60 bg-white/55 text-purple-700 backdrop-blur-md",
    eyebrow: "text-purple-600/80",
    title: "font-serif text-[clamp(1.65rem,5vw,2.4rem)] font-semibold leading-tight text-purple-950",
    accent: "font-serif text-[clamp(1.45rem,4.6vw,2.1rem)] italic leading-tight text-rose-700",
    body: "text-[clamp(0.68rem,2.3vw,0.88rem)] uppercase tracking-[0.17em] text-purple-800/80",
    divider: "bg-rose-500/35",
    alignment: "items-center justify-center text-center",
    decoration: "floral",
  },
  "office-corporate": {
    root: "bg-slate-950",
    overlay: "bg-gradient-to-br from-slate-950/25 via-blue-950/30 to-slate-950/82",
    panel: "border border-blue-100/20 bg-slate-950/48 text-white shadow-[0_28px_90px_rgba(15,23,42,0.45)] backdrop-blur-md",
    frameOuter: "border border-blue-100/45",
    frameInner: "border border-white/15",
    label: "border border-blue-200/25 bg-slate-950/45 text-blue-100 backdrop-blur-md",
    eyebrow: "text-blue-200/85",
    title: "text-[clamp(1.55rem,4.8vw,2.25rem)] font-bold leading-tight tracking-tight text-white",
    accent: "text-[clamp(0.74rem,2.5vw,0.95rem)] font-semibold uppercase tracking-[0.24em] text-blue-200",
    body: "text-[clamp(0.72rem,2.4vw,0.92rem)] leading-relaxed text-slate-100/90",
    divider: "bg-blue-200/45",
    alignment: "items-start justify-center text-left",
    decoration: "geometry",
  },
  "office-tech": {
    root: "bg-cyan-950",
    overlay: "bg-gradient-to-br from-slate-950/35 via-cyan-950/25 to-fuchsia-950/70",
    panel: "border border-cyan-300/30 bg-slate-950/55 text-white shadow-[0_28px_90px_rgba(34,211,238,0.22)] backdrop-blur-md",
    frameOuter: "border border-cyan-300/55",
    frameInner: "border border-fuchsia-300/20",
    label: "border border-cyan-300/30 bg-slate-950/50 text-cyan-100 backdrop-blur-md",
    eyebrow: "text-cyan-200/90",
    title: "font-mono text-[clamp(1.45rem,4.7vw,2.15rem)] font-bold leading-tight text-cyan-100",
    accent: "text-[clamp(0.72rem,2.4vw,0.92rem)] font-semibold uppercase tracking-[0.24em] text-fuchsia-200",
    body: "text-[clamp(0.72rem,2.4vw,0.92rem)] leading-relaxed text-cyan-50/90",
    divider: "bg-cyan-300/50",
    alignment: "items-start justify-center text-left",
    decoration: "geometry",
  },
  "office-executive": {
    root: "bg-stone-950",
    overlay: "bg-gradient-to-br from-stone-950/20 via-stone-900/25 to-stone-950/80",
    panel: "border border-amber-100/20 bg-stone-950/48 text-white shadow-[0_28px_90px_rgba(41,37,36,0.48)] backdrop-blur-md",
    frameOuter: "border border-amber-100/50",
    frameInner: "border border-white/15",
    label: "border border-amber-100/25 bg-stone-950/45 text-amber-50 backdrop-blur-md",
    eyebrow: "text-amber-100/85",
    title: "font-serif text-[clamp(1.55rem,4.9vw,2.25rem)] font-semibold leading-tight text-white",
    accent: "text-[clamp(0.72rem,2.4vw,0.92rem)] font-semibold uppercase tracking-[0.23em] text-amber-200",
    body: "text-[clamp(0.72rem,2.4vw,0.92rem)] leading-relaxed text-stone-100/90",
    divider: "bg-amber-100/45",
    alignment: "items-start justify-center text-left",
    decoration: "sparkle",
  },
  "office-creative": {
    root: "bg-indigo-950",
    overlay: "bg-gradient-to-br from-indigo-950/20 via-violet-950/30 to-fuchsia-950/70",
    panel: "border border-violet-100/20 bg-indigo-950/45 text-white shadow-[0_28px_90px_rgba(109,40,217,0.30)] backdrop-blur-md",
    frameOuter: "border border-violet-200/45",
    frameInner: "border border-fuchsia-100/15",
    label: "border border-violet-200/25 bg-indigo-950/40 text-violet-100 backdrop-blur-md",
    eyebrow: "text-violet-200/90",
    title: "text-[clamp(1.55rem,4.9vw,2.25rem)] font-black leading-tight tracking-tight text-white",
    accent: "text-[clamp(0.72rem,2.4vw,0.92rem)] font-semibold uppercase tracking-[0.24em] text-fuchsia-200",
    body: "text-[clamp(0.72rem,2.4vw,0.92rem)] leading-relaxed text-indigo-50/90",
    divider: "bg-violet-200/45",
    alignment: "items-start justify-center text-left",
    decoration: "geometry",
  },
  "birthday-pop": {
    root: "bg-fuchsia-950",
    overlay: "bg-gradient-to-b from-fuchsia-950/10 via-purple-950/15 to-fuchsia-950/65",
    panel: "border border-white/35 bg-white/16 text-white shadow-[0_26px_90px_rgba(192,38,211,0.30)] backdrop-blur-md",
    frameOuter: "border-2 border-white/65",
    frameInner: "border border-yellow-100/35",
    label: "border border-white/35 bg-fuchsia-950/30 text-white backdrop-blur-md",
    eyebrow: "text-yellow-100/90",
    title: "text-[clamp(1.35rem,4.5vw,2rem)] font-black uppercase leading-tight tracking-tight text-white",
    accent: "text-[clamp(1.7rem,5.5vw,2.65rem)] font-black leading-none text-yellow-100",
    body: "text-[clamp(0.72rem,2.5vw,0.94rem)] font-semibold text-white/90",
    divider: "bg-yellow-100/55",
    alignment: "items-center justify-start pt-12 text-center",
    decoration: "confetti",
  },
  "birthday-neon": {
    root: "bg-zinc-950",
    overlay: "bg-gradient-to-b from-zinc-950/5 via-purple-950/15 to-zinc-950/75",
    panel: "border border-cyan-300/25 bg-zinc-950/48 text-white shadow-[0_26px_95px_rgba(236,72,153,0.30)] backdrop-blur-md",
    frameOuter: "border border-pink-300/60",
    frameInner: "border border-cyan-300/20",
    label: "border border-pink-300/30 bg-zinc-950/45 text-pink-100 backdrop-blur-md",
    eyebrow: "text-cyan-200/90",
    title: "text-[clamp(1.35rem,4.5vw,2rem)] font-black uppercase leading-tight text-pink-200",
    accent: "text-[clamp(1.7rem,5.5vw,2.65rem)] font-black leading-none text-white drop-shadow-[0_0_16px_rgba(236,72,153,0.55)]",
    body: "text-[clamp(0.72rem,2.5vw,0.94rem)] font-semibold text-cyan-100/90",
    divider: "bg-cyan-300/55",
    alignment: "items-center justify-start pt-12 text-center",
    decoration: "confetti",
  },
  "birthday-watercolor": {
    root: "bg-rose-50",
    overlay: "bg-gradient-to-b from-white/5 via-white/15 to-rose-950/20",
    panel: "border border-white/60 bg-white/60 text-rose-950 shadow-[0_24px_80px_rgba(244,63,94,0.18)] backdrop-blur-md",
    frameOuter: "border border-white/70",
    frameInner: "border border-rose-200/55",
    label: "border border-white/60 bg-white/60 text-rose-700 backdrop-blur-md",
    eyebrow: "text-rose-600/85",
    title: "font-serif text-[clamp(1.35rem,4.5vw,2rem)] font-semibold leading-tight text-rose-800",
    accent: "font-serif text-[clamp(1.65rem,5.3vw,2.55rem)] font-bold leading-tight text-rose-950",
    body: "text-[clamp(0.72rem,2.5vw,0.94rem)] font-semibold text-rose-800/85",
    divider: "bg-rose-400/40",
    alignment: "items-center justify-start pt-12 text-center",
    decoration: "confetti",
  },
  "birthday-retro": {
    root: "bg-orange-950",
    overlay: "bg-gradient-to-b from-orange-950/5 via-red-950/15 to-orange-950/72",
    panel: "border border-amber-100/28 bg-red-950/42 text-white shadow-[0_26px_90px_rgba(194,65,12,0.35)] backdrop-blur-md",
    frameOuter: "border-2 border-amber-100/60",
    frameInner: "border border-orange-100/25",
    label: "border border-amber-100/35 bg-red-950/40 text-amber-50 backdrop-blur-md",
    eyebrow: "text-amber-100/90",
    title: "text-[clamp(1.35rem,4.5vw,2rem)] font-black uppercase leading-tight text-amber-100",
    accent: "text-[clamp(1.7rem,5.5vw,2.65rem)] font-black leading-none text-white",
    body: "text-[clamp(0.72rem,2.5vw,0.94rem)] font-semibold text-amber-50/90",
    divider: "bg-amber-100/55",
    alignment: "items-center justify-end pb-12 text-center",
    decoration: "confetti",
  },
};
