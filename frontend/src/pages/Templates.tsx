import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import { getTemplates } from "../lib/api";
import { TemplateCard } from "../components/TemplateCard";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

const FILTER_CATEGORIES = ["All", "Wedding", "Birthday", "Office", "Party"] as const;

function getSampleFieldData(category: string): Record<string, string | undefined> {
  if (category === "Wedding") {
    return {
      event_name: "Sarah & Michael",
      location: "St. Patrick Cathedral",
      event_date: "2026-10-15T18:00:00",
      bride_name: "Sarah",
      groom_name: "Michael",
      host_name: "The Anderson Family",
    };
  }

  if (category === "Birthday") {
    return {
      event_name: "Lucas's 10th Birthday",
      location: "Skyline Arcade Zone",
      event_date: "2026-09-20T15:00:00",
      birthday_person_name: "Lucas",
      host_name: "Emily & Mark",
    };
  }

  return {
    event_name: "Annual Gala & Awards",
    location: "Grand Plaza Ballroom",
    event_date: "2026-12-05T19:30:00",
    host_name: "Nexus Tech Corp",
  };
}

export function Templates(): React.ReactElement {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: templates, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const filtered = useMemo(() => {
    if (!templates) return [];

    let result = templates;

    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query),
      );
    }

    return result;
  }, [templates, activeCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Template Gallery
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Browse and choose a design for your invitation.
          </p>
        </div>
      </div>

      {/* Search + Filter Pills */}
      <div className="mb-8 space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="
              w-full rounded-xl border border-neutral-200 bg-white
              py-2.5 pl-10 pr-4 text-sm text-neutral-900
              placeholder:text-neutral-400
              focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20
              transition-colors
            "
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-[22px] border border-neutral-200 bg-white overflow-hidden">
              <div className="aspect-[3/4] bg-neutral-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                <div className="h-3 bg-neutral-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
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

      {/* Empty state */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <p className="text-lg font-medium text-neutral-600">No templates found</p>
          <p className="text-sm text-neutral-400">
            {searchQuery
              ? `No templates matching "${searchQuery}".`
              : activeCategory !== "All"
                ? `No templates in the "${activeCategory}" category yet.`
                : "Templates will appear here once they are added."}
          </p>
          {(searchQuery || activeCategory !== "All") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Template grid */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              category={template.category}
              thumbnailUrl={template.thumbnail_url}
              templateName={template.name}
              designSchema={template.design_schema}
              sampleFieldData={getSampleFieldData(template.category)}
              onClick={() =>
                navigate(`/events/create?step=2&templateId=${template.id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
