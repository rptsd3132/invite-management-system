import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";

import { getTemplates } from "../lib/api";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

import KasunNethmiExactWeddingTemplate from "../components/assets/wedding/KasunNethmiExactWeddingTemplate";
import SinhalaWeddingInvitationTemplate from "../components/assets/wedding/SinhalaWeddingInvitationTemplate";

import EnglishBirthdayInvitationTemplate from "../components/assets/birthday/EnglishBirthdayInvitationTemplate";
import SinhalaBirthdayInvitationTemplate from "../components/assets/birthday/SinhalaBirthdayInvitationTemplate";

import EnglishCorporateGalaInvitationTemplate from "../components/assets/office/EnglishCorporateGalaInvitationTemplate";
import SinhalaCorporateGalaInvitationTemplate from "../components/assets/office/SinhalaCorporateGalaInvitationTemplate";

const FILTER_CATEGORIES = [
  "All",
  "Wedding",
  "Birthday",
  "Office",
] as const;

/*
 * ACTIVE TEMPLATES
 */
const ACTIVE_TEMPLATE_NAMES = new Set([
  "Kasun & Nethmi Wedding",
  "Sinhala Wedding",
  "English Birthday",
  "Sinhala Birthday",
  "English Office",
  "Sinhala Office",
]);

interface TemplatePreviewProps {
  templateName: string;
}

function TemplatePreview({
  templateName,
}: TemplatePreviewProps): React.ReactElement {
  const commonDate = "2026-10-15T18:00:00";

  if (templateName === "Kasun & Nethmi Wedding") {
    return (
      <KasunNethmiExactWeddingTemplate
        groomName="Kasun"
        brideName="Nethmi"
        location="The Grand Ballroom, Colombo"
        date={commonDate}
        category="Wedding"
        language="en"
        compact
      />
    );
  }

  if (templateName === "Sinhala Wedding") {
    return (
      <SinhalaWeddingInvitationTemplate
        groomName="කසුන්"
        brideName="නෙත්මි"
        location="කොළඹ, ශ්‍රී ලංකාව"
        date={commonDate}
        category="මංගල ආරාධනා පත්‍රය"
        compact
      />
    );
  }

  if (templateName === "English Birthday") {
    return (
      <EnglishBirthdayInvitationTemplate
        eventName="Lucas's Birthday Celebration"
        birthdayPerson="Lucas"
        age="10"
        location="Skyline Celebration Hall"
        date="2026-09-20T15:00:00"
        category="Birthday"
        language="en"
        compact
      />
    );
  }

  if (templateName === "Sinhala Birthday") {
    return (
      <SinhalaBirthdayInvitationTemplate
        eventName="විශේෂ උපන් දින සැමරුම"
        birthdayPerson="නෙත්මි"
        age="21"
        location="කොළඹ"
        date="2026-09-20T15:00:00"
        category="Birthday"
        language="si"
        compact
      />
    );
  }

  if (templateName === "English Office") {
    return (
      <EnglishCorporateGalaInvitationTemplate
        eventName="Future Innovation Summit"
        companyName="Nexus Technologies"
        location="Grand Conference Hall"
        date="2026-12-05T19:30:00"
        category="Office"
        language="en"
      />
    );
  }

  if (templateName === "Sinhala Office") {
    return (
      <SinhalaCorporateGalaInvitationTemplate
        eventName="නවෝත්පාදන හා තාක්ෂණ සමුළුව"
        companyName="Nexus Technologies"
        location="කොළඹ සම්මන්ත්‍රණ ශාලාව"
        date="2026-12-05T19:30:00"
        category="Office"
        language="si"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
      Preview unavailable
    </div>
  );
}

interface CustomTemplateCardProps {
  name: string;
  category: string;
  onClick: () => void;
}

function CustomTemplateCard({
  name,
  category,
  onClick,
}: CustomTemplateCardProps): React.ReactElement {
  const categoryStyles =
    category === "Wedding"
      ? {
          badge:
            "bg-gradient-to-r from-amber-950 to-black text-amber-300",
          label: "text-amber-700",
        }
      : category === "Birthday"
        ? {
            badge:
              "bg-gradient-to-r from-fuchsia-950 to-purple-950 text-pink-300",
            label: "text-fuchsia-600",
          }
        : {
            badge:
              "bg-gradient-to-r from-slate-950 to-blue-950 text-sky-300",
            label: "text-blue-600",
          };

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[22px]
        border
        border-neutral-200
        bg-white
        text-left
        shadow-[0_12px_35px_rgba(15,23,42,0.08)]
        transition-all
        duration-500
        ease-out
        hover:-translate-y-2
        hover:border-neutral-300
        hover:shadow-[0_28px_70px_rgba(15,23,42,0.16)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand
        focus-visible:ring-offset-2
      "
    >
      {/* TEMPLATE PREVIEW */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            w-[900px]
            -translate-x-1/2
            -translate-y-1/2
            scale-[0.34]
            sm:scale-[0.36]
          "
        >
          <TemplatePreview templateName={name} />
        </div>

        {/* Hover overlay */}
        <div
          className="
            absolute
            inset-0
            z-20
            flex
            flex-col
            justify-end
            bg-zinc-950/0
            p-4
            opacity-0
            transition-all
            duration-300
            group-hover:bg-zinc-950/35
            group-hover:opacity-100
          "
        >
          <span
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              bg-white
              px-5
              py-2.5
              text-sm
              font-semibold
              text-zinc-900
              shadow-lg
            "
          >
            Use Template
            <span>→</span>
          </span>
        </div>

        {/* Premium Badge */}
        <div
          className={cn(
            "absolute right-3 top-3 z-30",
            "inline-flex items-center gap-1.5",
            "rounded-full px-3 py-1.5",
            "text-[9px] font-bold uppercase tracking-[0.16em]",
            "shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
            categoryStyles.badge,
          )}
        >
          <span>♛</span>
          Premium
        </div>
      </div>

      {/* Footer */}
      <div className="flex min-h-[78px] items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold tracking-tight text-neutral-900">
            {name}
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.14em]",
                categoryStyles.label,
              )}
            >
              {category}
            </span>

            <span className="h-1 w-1 rounded-full bg-neutral-300" />

            <span className="text-[11px] text-neutral-400">
              Invitation
            </span>
          </div>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-neutral-200
            bg-white
            text-lg
            text-neutral-500
            transition-all
            duration-300
            group-hover:border-brand/30
            group-hover:bg-brand/5
            group-hover:text-brand
          "
        >
          ♡
        </div>
      </div>
    </button>
  );
}

export function Templates(): React.ReactElement {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] =
    useState<string>("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const {
    data: templates,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  /*
   * IMPORTANT
   *
   * Backend may still contain old templates.
   * We DO NOT delete them from database here.
   *
   * We simply allow only the six new templates
   * to appear in the frontend gallery.
   */
  const activeTemplates = useMemo(() => {
    if (!templates) {
      return [];
    }

    return templates.filter((template) =>
      ACTIVE_TEMPLATE_NAMES.has(template.name),
    );
  }, [templates]);

  const filtered = useMemo(() => {
    let result = activeTemplates;

    if (activeCategory !== "All") {
      result = result.filter(
        (template) =>
          template.category === activeCategory,
      );
    }

    const query =
      searchQuery
        .trim()
        .toLowerCase();

    if (query) {
      result = result.filter(
        (template) =>
          template.name
            .toLowerCase()
            .includes(query) ||
          template.category
            .toLowerCase()
            .includes(query),
      );
    }

    return result;
  }, [
    activeTemplates,
    activeCategory,
    searchQuery,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Template Gallery
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Browse and choose a design for your invitation.
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search
            className="
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-neutral-400
            "
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search templates..."
            className="
              w-full
              rounded-xl
              border
              border-neutral-200
              bg-white
              py-2.5
              pl-10
              pr-4
              text-sm
              text-neutral-900
              transition-colors
              placeholder:text-neutral-400
              focus:border-brand
              focus:outline-none
              focus:ring-2
              focus:ring-brand/20
            "
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTER_CATEGORIES.map((category) => {
            const isActive =
              activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(category)
                }
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium",
                  "transition-all duration-200",
                  isActive
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="
                animate-pulse
                overflow-hidden
                rounded-[22px]
                border
                border-neutral-200
                bg-white
              "
            >
              <div className="aspect-[3/4] bg-neutral-100" />

              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-neutral-100" />
                <div className="h-3 w-1/4 rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {isError && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700">
            {(error as Error)?.message ??
              "Failed to load templates."}
          </p>

          <Button
            variant="outline"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* EMPTY */}
      {!isLoading &&
        !isError &&
        filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-12 text-center">
            <p className="text-lg font-medium text-neutral-600">
              No templates found
            </p>

            <p className="text-sm text-neutral-400">
              {searchQuery
                ? `No templates matching "${searchQuery}".`
                : activeCategory !== "All"
                  ? `No templates in the "${activeCategory}" category.`
                  : "The six active invitation templates were not found in the template API."}
            </p>

            {(searchQuery ||
              activeCategory !== "All") && (
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

      {/* SIX TEMPLATE GRID */}
      {!isLoading &&
        !isError &&
        filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((template) => (
              <CustomTemplateCard
                key={template.id}
                name={template.name}
                category={template.category}
                onClick={() =>
                  navigate(
                    `/events/create?step=2&templateId=${template.id}`,
                  )
                }
              />
            ))}
          </div>
        )}
    </div>
  );
}