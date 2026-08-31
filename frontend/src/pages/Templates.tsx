import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getTemplates } from "../lib/api";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import type { Template } from "../types";

const DEFAULT_TYPOGRAPHY = {
  title_classes:
    "font-serif text-[clamp(1.5rem,5vw,2.5rem)] font-semibold text-white",
  accent_classes:
    "font-serif text-[clamp(1rem,3.5vw,1.5rem)] italic text-white/90",
  body_classes:
    "text-[clamp(0.7rem,2vw,0.875rem)] uppercase tracking-[0.18em] text-white/80",
};

const DEFAULT_DESIGN_SCHEMA = {
  container_classes:
    "relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl shadow-xl",
  background: "bg-gradient-to-br from-slate-700 to-slate-950",
  decorations: [] as string[],
  typography: DEFAULT_TYPOGRAPHY,
  required_fields: [] as string[],
};

const categoryColors: Record<string, string> = {
  Wedding: "bg-pink-100 text-pink-700 border-pink-200",
  Office: "bg-blue-100 text-blue-700 border-blue-200",
  Birthday: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

function TemplatePreview({ template }: { template: Template }) {
  const navigate = useNavigate();

  const colorClass =
    categoryColors[template.category] ??
    "bg-neutral-100 text-neutral-700 border-neutral-200";

  const rawSchema = template.design_schema ?? {};

  const designSchema = {
    ...DEFAULT_DESIGN_SCHEMA,
    ...rawSchema,

    decorations: Array.isArray(rawSchema.decorations)
      ? rawSchema.decorations
      : [],

    required_fields: Array.isArray(rawSchema.required_fields)
      ? rawSchema.required_fields
      : [],

    typography: {
      ...DEFAULT_TYPOGRAPHY,
      ...(rawSchema.typography ?? {}),
    },
  };

  return (
    <button
      type="button"
      onClick={() => navigate(`/templates/${template.id}`)}
      className="group rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <div className="p-3">
          <div
            className={cn(
              "relative isolate overflow-hidden rounded-lg",
              designSchema.container_classes,
              designSchema.background,
            )}
            style={{
              maxWidth: "100%",
              aspectRatio: "3/4",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />

            <div className="pointer-events-none absolute inset-3 rounded-md border border-white/40" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
              <span
                className={cn(
                  designSchema.typography.title_classes,
                  "max-w-full truncate text-base",
                )}
              >
                {template.name}
              </span>

              <div
                className={cn(
                  designSchema.typography.accent_classes,
                  "mt-1 text-xs",
                )}
              >
                Preview
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 pb-3">
          <span className="truncate text-sm font-medium text-neutral-800">
            {template.name}
          </span>

          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-xs",
              colorClass,
            )}
          >
            {template.category}
          </span>
        </div>
      </div>
    </button>
  );
}



export function Templates(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const { data: templates, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const filtered = useMemo(() => {
    if (!templates) return [];
    if (!categoryFilter) return templates;
    return templates.filter((t) => t.category === categoryFilter);
  }, [templates, categoryFilter]);

  const categories = useMemo(() => {
    if (!templates) return [];
    return [...new Set(templates.map((t) => t.category))];
  }, [templates]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            {categoryFilter ? categoryFilter : "All"} Templates
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {categoryFilter
              ? `Showing ${filtered.length} template${filtered.length !== 1 ? "s" : ""}`
              : `${templates?.length ?? 0} template${templates?.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      {categories.length > 1 && !categoryFilter && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => navigate(`/templates?category=${encodeURIComponent(cat)}`)}
              className={cn(
                "text-sm px-3 py-1 rounded-full border transition-colors",
                categoryColors[cat] ?? "bg-neutral-100 text-neutral-700 border-neutral-200",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white overflow-hidden">
              <div className="aspect-[3/4] bg-neutral-100 m-3 rounded-lg" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                <div className="h-3 bg-neutral-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700">
            {(error as Error)?.message ?? "Failed to load templates."}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <p className="text-lg font-medium text-neutral-600">No templates found</p>
          <p className="text-sm text-neutral-400">
            {categoryFilter
              ? `No templates in the "${categoryFilter}" category yet.`
              : "Templates will appear here once they are added."}
          </p>
          {categoryFilter && (
            <Button variant="outline" onClick={() => navigate("/templates")}>
              View All Templates
            </Button>
          )}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((template) => (
            <TemplatePreview key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
