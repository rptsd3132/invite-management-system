import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

const CATEGORIES = [
  { label: "Wedding", color: "bg-orange-100", to: "/templates?category=Wedding" },
  { label: "Birthday", color: "bg-pink-100", to: "/templates?category=Birthday" },
  { label: "Baby & Kids", color: "bg-cyan-100", to: "/templates" },
  { label: "Party", color: "bg-purple-100", to: "/templates" },
  { label: "Greeting cards", color: "bg-emerald-100", to: "/templates" },
  { label: "Office", color: "bg-yellow-100", to: "/templates?category=Office" },
];

const SAMPLE_TITLES: Record<string, string> = {
  Wedding: "Mr & Mrs",
  Birthday: "Happy Birthday!",
  "Baby & Kids": "It's a Boy!",
  Party: "Let's Party",
  "Greeting cards": "Hello Friend",
  Office: "You're Invited",
};

interface CategoryCardProps {
  label: string;
  color: string;
  sampleTitle: string;
  onSelect: () => void;
}

function CategoryCard({
  label,
  color,
  sampleTitle,
  onSelect,
}: CategoryCardProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex h-56 flex-col items-center rounded-2xl p-4 pt-6 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/10",
        color,
      )}
    >
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex aspect-[3/4] w-3/4 max-w-32 rotate-[-3deg] items-center justify-center rounded-lg bg-white p-2 shadow-md transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-105">
          <span className="text-center text-[11px] font-medium tracking-wide text-zinc-500">
            {sampleTitle}
          </span>
        </div>
      </div>
      <span className="mt-4 text-sm font-semibold text-zinc-800">{label}</span>
    </button>
  );
}

function AIPremiumBanner(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-16 shadow-xl shadow-indigo-500/20 sm:px-12">
      {/* Decorative stars */}
      <Sparkles
        aria-hidden
        className="absolute left-8 top-8 h-8 w-8 text-white/70"
      />
      <Sparkles
        aria-hidden
        className="absolute left-1/2 top-6 h-5 w-5 text-white/50"
      />
      <svg
        aria-hidden
        viewBox="0 0 200 40"
        className="pointer-events-none absolute bottom-10 right-8 h-10 w-48 text-white/60 sm:right-1/4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M0 30 Q 25 5 50 25 T 100 20 T 150 28 T 200 15" />
      </svg>

      {/* Overlapping template cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 top-1/2 hidden -translate-y-1/2 md:block"
      >
        <div className="flex aspect-[3/4] w-40 rotate-[-6deg] rounded-xl bg-white/95 p-3 shadow-2xl shadow-indigo-950/30">
          <div className="flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100">
            <span className="text-xs font-semibold text-rose-400">Invite</span>
          </div>
        </div>
        <div className="absolute -left-24 top-1/2 flex aspect-[3/4] w-36 rotate-[3deg] -translate-y-1/2 rounded-xl bg-white/90 p-3 shadow-2xl shadow-indigo-950/30">
          <div className="flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-100">
            <span className="text-xs font-semibold text-cyan-500">Invite</span>
          </div>
        </div>
        <div className="absolute -left-10 bottom-0 flex aspect-[3/4] w-32 rotate-[-2deg] translate-y-1/3 rounded-xl bg-white/85 p-2.5 shadow-2xl shadow-indigo-950/30">
          <div className="flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100">
            <span className="text-xs font-semibold text-violet-500">Invite</span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-8 md:ml-auto md:w-1/2 md:items-start">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
           
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Magic invite.
          </h2>
        </div>
        <button
          type="button"
          onClick={() => navigate("/templates")}
          className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-purple-700 shadow-lg shadow-indigo-950/20 transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
        >
          Try Magic Invite
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export function Landing(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Category strip */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200/80 py-3">
        <div className="hidden items-center gap-7 overflow-x-auto sm:flex">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => navigate(cat.to)}
              className="whitespace-nowrap text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate("/templates")}
          aria-label="Search templates"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          <Search className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          <span className="text-emerald-600">Invitation</span>{" "}
          <span className="text-zinc-900">maker</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-zinc-500 sm:text-lg">
          Design beautiful invitations for every occasion — weddings, birthdays,
          parties and more. Pick a style, add your details, and share the magic.
        </p>
      </section>

      {/* Pastel category grid */}
      <section className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.label}
            label={cat.label}
            color={cat.color}
            sampleTitle={SAMPLE_TITLES[cat.label]}
            onSelect={() => navigate(cat.to)}
          />
        ))}
      </section>

      {/* AI premium banner */}
      <div className="py-16 sm:py-20">
        <AIPremiumBanner />
      </div>
    </div>
  );
}