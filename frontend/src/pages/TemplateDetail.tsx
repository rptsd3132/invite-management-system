import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  CalendarDays,
  MapPin,
  UserRound,
  Sparkles,
  Crown,
} from "lucide-react";

import { getTemplates } from "../lib/api";
import { TemplateRenderer } from "../components/ui/TemplateRenderer";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

import type { Template } from "../types";

const sampleData: Record<string, Record<string, string>> = {
  Wedding: {
    event_name: "Our Wedding Day",
    bride_name: "Sarah",
    groom_name: "James",
    participant_name: "Emily & Family",
    event_date_time: "Saturday, June 14, 2026 at 4:00 PM",
    event_location: "The Grand Rose Garden, 123 Blossom Lane",
  },

  Office: {
    event_name: "Annual Innovation Summit 2026",
    participant_name: "Alex",
    event_date_time: "Friday, May 22, 2026 at 9:00 AM",
    event_location: "Convention Center, 456 Business Ave",
  },

  Birthday: {
    event_name: "Emma's 16th Birthday Bash",
    participant_name: "Sophie",
    birthday_person_name: "Emma",
    event_date_time: "Saturday, August 8, 2026 at 7:00 PM",
    event_location: "The Party Palace, 789 Celebration Blvd",
  },
};

const fallbackData: Record<string, string> = {
  bride_name: "Sarah",
  groom_name: "James",
  event_name: "Annual Gala 2026",
  participant_name: "Guest",
  birthday_person_name: "Alex",
  event_date_time: "Saturday, June 14, 2026 at 4:00 PM",
  event_location: "Grand Venue, 123 Main Street",
};

function getCategoryTheme(category: string): {
  badge: string;
  accentText: string;
  accentBg: string;
  button: string;
  glow: string;
  panel: string;
} {
  if (category === "Wedding") {
    return {
      badge:
        "border-amber-200 bg-amber-50 text-amber-700",
      accentText: "text-amber-600",
      accentBg: "bg-amber-50",
      button:
        "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700",
      glow:
        "shadow-[0_25px_90px_rgba(217,119,6,0.18)]",
      panel:
        "from-amber-50/70 via-white to-orange-50/40",
    };
  }

  if (category === "Birthday") {
    return {
      badge:
        "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
      accentText: "text-fuchsia-600",
      accentBg: "bg-fuchsia-50",
      button:
        "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-600 hover:from-fuchsia-600 hover:via-purple-600 hover:to-violet-700",
      glow:
        "shadow-[0_25px_90px_rgba(168,85,247,0.20)]",
      panel:
        "from-fuchsia-50/60 via-white to-purple-50/50",
    };
  }

  return {
    badge:
      "border-sky-200 bg-sky-50 text-sky-700",
    accentText: "text-sky-600",
    accentBg: "bg-sky-50",
    button:
      "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-800",
    glow:
      "shadow-[0_25px_90px_rgba(37,99,235,0.18)]",
    panel:
      "from-sky-50/60 via-white to-blue-50/50",
  };
}

function getFieldIcon(field: string): React.ReactElement {
  if (
    field.includes("date") ||
    field.includes("time")
  ) {
    return <CalendarDays className="h-4 w-4" />;
  }

  if (field.includes("location")) {
    return <MapPin className="h-4 w-4" />;
  }

  return <UserRound className="h-4 w-4" />;
}

function formatFieldName(field: string): string {
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function TemplateDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: templates,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const template: Template | undefined =
    templates?.find((item) => item.id === id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-52 rounded-xl bg-neutral-100" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="mx-auto aspect-[3/4] w-full max-w-md rounded-[32px] bg-neutral-100" />

            <div className="space-y-4">
              <div className="h-8 w-1/2 rounded-lg bg-neutral-100" />
              <div className="h-20 rounded-xl bg-neutral-100" />
              <div className="h-20 rounded-xl bg-neutral-100" />
              <div className="h-20 rounded-xl bg-neutral-100" />
              <div className="h-12 rounded-xl bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/templates")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </Button>

        <div
          className="
            mt-8
            flex
            flex-col
            items-center
            gap-4
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-8
            text-center
          "
        >
          <p className="font-medium text-red-700">
            {!template
              ? "Template not found"
              : (error as Error)?.message ??
                "Failed to load template."}
          </p>
        </div>
      </div>
    );
  }

  const schema = template.design_schema;

  const categorySample =
    sampleData[template.category] ??
    fallbackData;

  const previewData: Record<
    string,
    string | undefined
  > = {
    ...categorySample,
  };

  const theme = getCategoryTheme(
    template.category,
  );

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-neutral-50
        via-white
        to-neutral-100
      "
    >
      <div className="mx-auto max-w-[1450px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/templates")}
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-neutral-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-neutral-600
            shadow-sm
            transition-all
            hover:-translate-x-0.5
            hover:border-neutral-300
            hover:text-neutral-950
            hover:shadow-md
          "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </button>

        {/* Header */}
        <div className="mb-10 mt-7 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5",
                  "text-[11px] font-bold uppercase tracking-[0.16em]",
                  theme.badge,
                )}
              >
                <Crown className="h-3.5 w-3.5" />
                Premium
              </span>

              <span
                className={cn(
                  "inline-flex rounded-full border px-3 py-1.5",
                  "text-[11px] font-semibold uppercase tracking-[0.14em]",
                  theme.badge,
                )}
              >
                {template.category}
              </span>
            </div>

            <h1
              className="
                max-w-4xl
                text-3xl
                font-bold
                tracking-tight
                text-neutral-950
                sm:text-4xl
                lg:text-5xl
              "
            >
              {template.name}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500 sm:text-base">
              A professionally styled{" "}
              {template.category.toLowerCase()} invitation
              with premium typography, visual hierarchy,
              elegant spacing, and structured event details.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              self-start
              rounded-2xl
              border
              border-neutral-200
              bg-white
              px-4
              py-3
              shadow-sm
              xl:self-auto
            "
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                theme.accentBg,
                theme.accentText,
              )}
            >
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                Template Style
              </p>

              <p className="text-sm font-semibold text-neutral-800">
                Premium Collection
              </p>
            </div>
          </div>
        </div>

        {/* Main section */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_430px] xl:gap-14">
          {/* Invitation preview */}
          <section>
            <div
              className={cn(
                "relative mx-auto max-w-[600px]",
                "rounded-[40px]",
                "border border-white/80",
                "bg-gradient-to-br",
                theme.panel,
                "p-4 sm:p-6",
                theme.glow,
              )}
            >
              {/* glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -inset-4
                  -z-10
                  rounded-[48px]
                  bg-gradient-to-br
                  from-white/60
                  via-transparent
                  to-neutral-200/40
                  blur-2xl
                "
              />

              <div
                className="
                  rounded-[34px]
                  border
                  border-white
                  bg-white/80
                  p-3
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
                  backdrop-blur-xl
                  sm:p-4
                "
              >
                <TemplateRenderer
                  designSchema={schema}
                  fieldData={previewData}
                />
              </div>
            </div>
          </section>

          {/* Data panel */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div
              className="
                overflow-hidden
                rounded-[28px]
                border
                border-neutral-200/80
                bg-white/90
                shadow-[0_24px_80px_rgba(15,23,42,0.10)]
                backdrop-blur-xl
              "
            >
              {/* Panel header */}
              <div className="border-b border-neutral-100 px-6 py-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xl font-bold text-neutral-950">
                      Preview Data
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Example information displayed in this invitation.
                    </p>
                  </div>

                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                      theme.accentBg,
                      theme.accentText,
                    )}
                  >
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3 p-5 sm:p-6">
                {schema.required_fields.map(
                  (field) => (
                    <div
                      key={field}
                      className="
                        group
                        rounded-2xl
                        border
                        border-neutral-100
                        bg-neutral-50/70
                        p-4
                        transition-all
                        duration-300
                        hover:border-neutral-200
                        hover:bg-white
                        hover:shadow-sm
                      "
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            theme.accentBg,
                            theme.accentText,
                          )}
                        >
                          {getFieldIcon(field)}
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-[0.16em]
                              text-neutral-400
                            "
                          >
                            {formatFieldName(field)}
                          </p>

                          <p
                            className="
                              mt-1
                              break-words
                              text-sm
                              font-medium
                              leading-6
                              text-neutral-800
                            "
                          >
                            {previewData[field] ??
                              `{{${field}}}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Button */}
              <div className="border-t border-neutral-100 p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => navigate("/events/create")}
                  className={cn(
                    "flex w-full items-center justify-center gap-2",
                    "rounded-2xl px-6 py-4",
                    "text-sm font-bold text-white",
                    "shadow-[0_15px_40px_rgba(0,0,0,0.16)]",
                    "transition-all duration-300",
                    "hover:-translate-y-1",
                    "hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)]",
                    "active:translate-y-0",
                    theme.button,
                  )}
                >
                  Use This Template
                  <ExternalLink className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-[11px] text-neutral-400">
                  You can customize event details in the next step.
                </p>
              </div>
            </div>

            {/* Required fields */}
            <div
              className="
                mt-5
                rounded-2xl
                border
                border-neutral-200
                bg-white/80
                px-5
                py-4
                shadow-sm
                backdrop-blur
              "
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                Required Fields
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {schema.required_fields.map(
                  (field) => (
                    <span
                      key={field}
                      className="
                        rounded-full
                        border
                        border-neutral-200
                        bg-neutral-50
                        px-3
                        py-1.5
                        text-[10px]
                        font-medium
                        text-neutral-600
                      "
                    >
                      {formatFieldName(field)}
                    </span>
                  ),
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}