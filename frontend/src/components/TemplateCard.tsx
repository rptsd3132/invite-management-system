import type { ReactElement } from "react";

import { cn } from "../lib/utils";
import { resolveTemplateImage } from "./assets/templateImages";
import { Card } from "./ui/Card";

const PASTEL_VARIANTS = [
  "peach",
  "blush",
  "sky",
  "lilac",
  "mint",
  "cream",
] as const;

type PastelVariant = (typeof PASTEL_VARIANTS)[number];

interface TemplateCardProps {
  category: string;
  thumbnailUrl: string | null;
  onClick: () => void;
  index?: number;
  className?: string;
  templateName?: string;
}

export function TemplateCard({
  category,
  thumbnailUrl,
  onClick,
  index = 0,
  className,
  templateName,
}: TemplateCardProps): ReactElement {
  const pastelVariant = PASTEL_VARIANTS[
    index % PASTEL_VARIANTS.length
  ] as PastelVariant;

  const imageSource =
    resolveTemplateImage(thumbnailUrl) ?? thumbnailUrl ?? undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-64 shrink-0 snap-start rounded-xl text-left",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-brand focus-visible:ring-offset-2",
        "md:w-72",
        className,
      )}
    >
      <Card
        pastel={pastelVariant}
        className={cn(
          "overflow-hidden transition-all duration-300",
          "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl",
        )}
      >
        <div className="relative m-3 aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 shadow-sm">
          {imageSource ? (
            <>
              <img
                src={imageSource}
                alt={templateName ?? category}
                className={cn(
                  "h-full w-full object-cover",
                  "transition-transform duration-500",
                  "group-hover:scale-105",
                )}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />

              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                {templateName && (
                  <p className="text-base font-semibold leading-tight drop-shadow">
                    {templateName}
                  </p>
                )}

                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/85">
                  Preview
                </p>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/90 to-white/50 text-neutral-400">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>

              <span className="text-xs">{category}</span>
            </div>
          )}
        </div>

        <div className="px-4 pb-4 text-center">
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-sm font-medium",
              "bg-neutral-900/5 text-neutral-700",
              "transition-colors",
              "group-hover:bg-brand/10 group-hover:text-brand",
            )}
          >
            {category}
          </span>
        </div>
      </Card>
    </button>
  );
}