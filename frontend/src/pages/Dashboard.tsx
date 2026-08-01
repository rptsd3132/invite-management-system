import { useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UploadCloud, ArrowRight } from "lucide-react";
import { getTemplates } from "../lib/api";
import { Card } from "../components/ui/Card";
import { TemplateCard } from "../components/TemplateCard";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import type { Template } from "../types";

function SkeletonCard(): React.ReactElement {
  return (
    <div className="animate-pulse snap-start shrink-0 w-64 md:w-72 rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <div className="m-3 aspect-[4/3] rounded-lg bg-neutral-100" />
      <div className="flex justify-center pb-4">
        <div className="h-6 w-20 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

function groupByCategory(templates: Template[]): Map<string, Template> {
  const map = new Map<string, Template>();
  for (const t of templates) {
    if (!map.has(t.category)) {
      map.set(t.category, t);
    }
  }
  return map;
}

export function Dashboard(): React.ReactElement {
  const navigate = useNavigate();
  const galleryRef = useRef<HTMLDivElement>(null);

  const { data: templates, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const categoryCards = useMemo(() => {
    if (!templates) return [];
    const grouped = groupByCategory(templates);
    return Array.from(grouped.entries()).map(([category, template], idx) => ({
      category,
      thumbnailUrl: template.thumbnail_url,
      index: idx,
    }));
  }, [templates]);

  const uniqueCategories = useMemo(() => {
    if (!templates) return [];
    const seen = new Set<string>();
    return templates.filter((t) => {
      if (seen.has(t.category)) return false;
      seen.add(t.category);
      return true;
    }).map((t) => t.category);
  }, [templates]);

  const heroThumbnails = useMemo(() => {
    return templates?.filter((t): t is Template & { thumbnail_url: string } => t.thumbnail_url !== null).slice(0, 2) ?? [];
  }, [templates]);

  const scrollToGallery = (): void => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Quick Category Strip */}
      {!isLoading && !isError && uniqueCategories.length > 0 && (
        <div className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-6 [mask-image:linear-gradient(to_right,black_90%,transparent_100%)]">
          {uniqueCategories.map((cat) => (
            <Link
              key={cat}
              to={`/templates?category=${encodeURIComponent(cat)}`}
              className="whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-brand hover:underline decoration-brand underline-offset-4 transition-colors shrink-0"
            >
              {cat}
            </Link>
          ))}
          <Link
            to="/templates"
            className="whitespace-nowrap text-sm font-medium text-neutral-400 hover:text-brand hover:underline decoration-brand underline-offset-4 transition-colors shrink-0"
          >
            Upload Your Own
          </Link>
        </div>
      )}

      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 rounded-2xl bg-neutral-100/60 p-6 md:p-10">
        {/* Left — decorative image area */}
        <div className="relative h-64 md:h-80 w-full">
          {heroThumbnails.length > 0 ? (
            <>
              <div className="absolute top-4 left-2 w-48 sm:w-56 -rotate-3 shadow-lg rounded-xl overflow-hidden bg-white">
                <img
                  src={heroThumbnails[0].thumbnail_url}
                  alt=""
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              {heroThumbnails.length > 1 && (
                <div className="absolute bottom-4 right-2 w-40 sm:w-48 rotate-2 shadow-lg rounded-xl overflow-hidden bg-white">
                  <img
                    src={heroThumbnails[1].thumbnail_url}
                    alt=""
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="absolute top-4 left-2 w-48 sm:w-56 -rotate-3 shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-pastel-peach to-pastel-blush">
                <div className="aspect-[4/3]" />
              </div>
              <div className="absolute bottom-4 right-2 w-40 sm:w-48 rotate-2 shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-pastel-sky to-pastel-lilac">
                <div className="aspect-[4/3]" />
              </div>
            </>
          )}
        </div>

        {/* Right — headline + CTAs */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
            <span className="text-brand">Invitation</span>
            -maker
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-lg">
            Explore a wide range of categories to find the perfect invitation for your event.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-full"
              onClick={scrollToGallery}
            >
              Browse Templates
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => navigate("/create-event")}
            >
              Create an Event
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section ref={galleryRef}>
        <h2 className={cn(
          "text-2xl sm:text-3xl font-bold text-center mb-8",
          categoryCards.length > 0 ? "text-brand" : "text-neutral-900",
        )}>
          Invitation categories
        </h2>

        {isLoading && (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
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

        {!isLoading && !isError && categoryCards.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-12 text-center">
            <UploadCloud className="h-12 w-12 text-neutral-300" />
            <p className="text-lg font-medium text-neutral-600">No templates yet</p>
            <p className="text-sm text-neutral-400">
              Templates will appear here once they are added.
            </p>
          </div>
        )}

        {!isLoading && !isError && categoryCards.length > 0 && (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [mask-image:linear-gradient(to_right,black_80%,transparent_100%)]">
            {categoryCards.map((card) => (
              <TemplateCard
                key={card.category}
                category={card.category}
                thumbnailUrl={card.thumbnailUrl}
                onClick={() => navigate(`/templates?category=${encodeURIComponent(card.category)}`)}
                index={card.index}
              />
            ))}

            {/* Upload your own */}
            <button
              type="button"
              onClick={() => navigate("/templates")}
              className="snap-start shrink-0 w-64 md:w-72 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-xl"
            >
              <Card className="border-2 border-dashed border-neutral-300 bg-neutral-50 hover:-translate-y-1 hover:scale-[1.02] transition-transform h-full">
                <div className="flex aspect-[4/3] items-center justify-center m-3 rounded-lg">
                  <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <UploadCloud className="h-10 w-10" />
                    <span className="text-sm font-medium">Upload your own</span>
                  </div>
                </div>
                <div className="pb-4 text-center">
                  <span className="inline-block rounded-full px-3 py-1 text-sm font-medium text-neutral-400">
                    Custom
                  </span>
                </div>
              </Card>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
