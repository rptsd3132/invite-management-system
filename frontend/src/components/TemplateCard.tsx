import type { ReactElement } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { TemplateRenderer } from "./ui/TemplateRenderer";
import type { Template } from "../types";

interface TemplateCardProps {
  category: string;
  thumbnailUrl: string | null;
  onClick: () => void;
  index?: number;
  className?: string;
  templateName?: string;
  selected?: boolean;
  designSchema?: Template["design_schema"];
  sampleFieldData?: Record<string, string | undefined>;
}

function getCategoryStyle(category: string): {
  badge: string;
  label: string;
} {
  if (category === "Wedding") {
    return {
      badge:
        "bg-gradient-to-r from-amber-950/95 to-black/90 text-amber-300",
      label: "text-amber-700",
    };
  }

  if (category === "Birthday") {
    return {
      badge:
        "bg-gradient-to-r from-fuchsia-950/95 to-purple-950/95 text-pink-300",
      label: "text-fuchsia-600",
    };
  }

  return {
    badge:
      "bg-gradient-to-r from-slate-950/95 to-blue-950/95 text-sky-300",
    label: "text-blue-600",
  };
}

export function TemplateCard({
  category,
  thumbnailUrl,
  onClick,
  className,
  templateName,
  selected = false,
  designSchema,
  sampleFieldData,
}: TemplateCardProps): ReactElement {
  const imageSource = thumbnailUrl ?? undefined;

  const categoryStyle = getCategoryStyle(category);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-[22px]",
        "border bg-white text-left",
        "transition-all duration-500 ease-out",
        selected
          ? "border-brand ring-2 ring-brand/30 ring-offset-2 shadow-[0_24px_70px_rgba(147,51,234,0.20)]"
          : "border-neutral-200 shadow-[0_12px_35px_rgba(15,23,42,0.08)]",
        "hover:-translate-y-2",
        "hover:border-neutral-300",
        "hover:shadow-[0_28px_70px_rgba(15,23,42,0.16)]",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-brand",
        "focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Image / Live Preview */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {designSchema && sampleFieldData ? (
          <div className="relative h-full w-full overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-[550px] w-[400px] origin-top-left scale-[0.55] sm:scale-[0.6]">
              <TemplateRenderer
                designSchema={designSchema}
                fieldData={sampleFieldData}
              />
            </div>

            <div
              className="
                absolute inset-0 z-10
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                bg-zinc-900/40 backdrop-blur-[2px]
                flex flex-col justify-end p-4
              "
            >
              <span
                className="
                  inline-flex w-fit items-center gap-2
                  rounded-xl bg-white px-5 py-2.5
                  text-sm font-semibold text-zinc-900
                  shadow-lg
                  transition-transform duration-200
                  group-hover:translate-y-0
                  translate-y-2
                "
              >
                Use Template
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        ) : imageSource ? (
          <img
            src={imageSource}
            alt={templateName ?? category}
            className="
              h-full w-full object-cover
              transition-transform duration-1000 ease-out
              group-hover:scale-[1.05]
            "
          />
        ) : (
          <div
            className="
              flex h-full items-center justify-center
              bg-neutral-100 text-sm text-neutral-400
            "
          >
            No Preview
          </div>
        )}

        {!designSchema && (
          <>
            <div
              className="
                pointer-events-none absolute inset-0
                bg-gradient-to-t from-black/35 via-transparent to-black/5
              "
            />
            <div
              className="
                pointer-events-none absolute inset-0
                bg-gradient-to-br from-white/10 via-transparent to-transparent
              "
            />
          </>
        )}

        <div
          className={cn(
            "absolute right-3 top-3 z-20",
            "inline-flex items-center gap-1.5",
            "rounded-full px-3 py-1.5",
            "text-[9px] font-bold uppercase tracking-[0.16em]",
            "shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
            "backdrop-blur-xl",
            categoryStyle.badge,
          )}
        >
          <span className="text-[11px]">♛</span>
          Premium
        </div>

        {selected && (
          <div
            className="
              absolute left-3 top-3 z-20
              flex h-9 w-9 items-center justify-center
              rounded-full bg-brand text-sm font-bold text-white shadow-lg
            "
          >
            ✓
          </div>
        )}

        {!designSchema && (
          <div
            className="
              pointer-events-none absolute inset-x-0 bottom-0 h-20
              bg-gradient-to-t from-black/25 to-transparent
            "
          />
        )}
      </div>

      <div className="flex min-h-[78px] items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              text-[14px]
              font-bold
              tracking-tight
              text-neutral-900
            "
          >
            {templateName ?? "Premium Invitation"}
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.14em]",
                categoryStyle.label,
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
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center",
            "rounded-full border",
            "text-lg transition-all duration-300",
            selected
              ? "border-brand bg-brand text-white"
              : "border-neutral-200 bg-white text-neutral-500",
            "group-hover:border-brand/30",
            "group-hover:bg-brand/5",
            "group-hover:text-brand",
          )}
        >
          {selected ? "✓" : "♡"}
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-[3px]",
          "transition-opacity duration-300",
          selected
            ? "bg-brand opacity-100"
            : "bg-brand opacity-0 group-hover:opacity-40",
        )}
      />
    </button>
  );
}