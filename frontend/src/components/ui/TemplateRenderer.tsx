import type { ReactElement } from "react";
import { cn } from "../../lib/utils";

interface DesignTypography {
  title_classes: string;
  accent_classes: string;
  body_classes: string;
}

interface DesignSchema {
  container_classes: string;
  background: string;
  decorations: string[];
  typography: DesignTypography;
  required_fields: string[];
}

interface TemplateRendererProps {
  designSchema: DesignSchema;
  fieldData: Record<string, string | undefined>;
}

function formatFieldName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function fieldStyle(
  field: string,
  requiredFields: string[],
  typography: DesignTypography,
  index: number,
): string {
  const isFirst = index === 0;
  const isLast = index === requiredFields.length - 1;

  const isDateOrLocation =
    field.includes("date") || field.includes("location");

  if (isFirst) {
    return typography.title_classes;
  }

  if (isDateOrLocation || isLast) {
    return typography.body_classes;
  }

  return typography.accent_classes;
}

function Decoration({
  type,
  index,
}: {
  type: string;
  index: number;
}): ReactElement | null {
  switch (type) {
    case "pink-flower-top-left":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute -left-5 -top-5 h-32 w-32"
        >
          <div className="absolute left-9 top-1 h-16 w-9 rotate-12 rounded-[50%] bg-pink-300/70" />
          <div className="absolute left-2 top-9 h-9 w-16 -rotate-12 rounded-[50%] bg-rose-200/80" />
          <div className="absolute left-14 top-9 h-9 w-16 rotate-12 rounded-[50%] bg-pink-400/60" />
          <div className="absolute left-9 top-14 h-16 w-9 -rotate-12 rounded-[50%] bg-rose-300/70" />
          <div className="absolute left-[47px] top-[47px] h-8 w-8 rounded-full bg-amber-200" />
        </div>
      );

    case "purple-flower-bottom-right":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute -bottom-5 -right-5 h-32 w-32"
        >
          <div className="absolute left-9 top-1 h-16 w-9 rotate-12 rounded-[50%] bg-purple-300/70" />
          <div className="absolute left-2 top-9 h-9 w-16 -rotate-12 rounded-[50%] bg-violet-200/80" />
          <div className="absolute left-14 top-9 h-9 w-16 rotate-12 rounded-[50%] bg-fuchsia-300/60" />
          <div className="absolute left-9 top-14 h-16 w-9 -rotate-12 rounded-[50%] bg-purple-400/70" />
          <div className="absolute left-[47px] top-[47px] h-8 w-8 rounded-full bg-amber-200" />
        </div>
      );

    case "leaf-top-right":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute -right-4 -top-3 h-36 w-28 rotate-12"
        >
          <div className="absolute right-10 top-3 h-28 w-1 rotate-[25deg] bg-emerald-700/50" />

          <div className="absolute right-7 top-5 h-8 w-4 rotate-45 rounded-full bg-emerald-400/60" />
          <div className="absolute right-12 top-8 h-8 w-4 -rotate-45 rounded-full bg-green-500/60" />

          <div className="absolute right-3 top-14 h-9 w-4 rotate-45 rounded-full bg-emerald-300/70" />
          <div className="absolute right-11 top-17 h-9 w-4 -rotate-45 rounded-full bg-green-400/70" />

          <div className="absolute right-1 top-24 h-8 w-4 rotate-45 rounded-full bg-emerald-500/50" />
        </div>
      );

    case "leaf-bottom-left":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute -bottom-4 -left-4 h-36 w-28 rotate-180"
        >
          <div className="absolute right-10 top-3 h-28 w-1 rotate-[25deg] bg-emerald-700/50" />

          <div className="absolute right-7 top-5 h-8 w-4 rotate-45 rounded-full bg-emerald-400/60" />
          <div className="absolute right-12 top-8 h-8 w-4 -rotate-45 rounded-full bg-green-500/60" />

          <div className="absolute right-3 top-14 h-9 w-4 rotate-45 rounded-full bg-emerald-300/70" />
          <div className="absolute right-11 top-17 h-9 w-4 -rotate-45 rounded-full bg-green-400/70" />
        </div>
      );

    case "gold-frame":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute inset-4 border border-amber-500/60"
        />
      );

    case "inner-gold-frame":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute inset-7 border border-amber-300/30"
        />
      );

    case "top-pink-circle":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-pink-200/50"
        />
      );

    case "bottom-purple-circle":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-purple-200/50"
        />
      );

    case "confetti":
      return (
        <div
          key={`${type}-${index}`}
          className="pointer-events-none absolute inset-0"
        >
          <span className="absolute left-8 top-10 h-3 w-3 rotate-45 bg-yellow-400" />
          <span className="absolute right-10 top-16 h-3 w-3 rounded-full bg-pink-400" />
          <span className="absolute bottom-16 left-12 h-2 w-5 rotate-45 bg-blue-400" />
          <span className="absolute bottom-10 right-12 h-4 w-4 rotate-12 bg-purple-400" />
          <span className="absolute left-6 top-1/2 h-3 w-3 rounded-full bg-green-400" />
          <span className="absolute right-6 top-1/2 h-2 w-5 -rotate-45 bg-orange-400" />
        </div>
      );

    default:
      return null;
  }
}

export function TemplateRenderer({
  designSchema,
  fieldData,
}: TemplateRendererProps): ReactElement {
  const {
    container_classes,
    background,
    decorations = [],
    typography,
    required_fields,
  } = designSchema;

  return (
    <div
      className={cn(
        container_classes,
        background,
        "isolate",
      )}
    >
      <div className="absolute inset-0 z-0">
        {decorations.map((decoration, index) => (
          <Decoration
            key={`${decoration}-${index}`}
            type={decoration}
            index={index}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-full w-full flex-1 flex-col items-center justify-center px-8 py-12">
        {required_fields.map((field, index) => {
          const value = fieldData[field];
          const displayValue = value || formatFieldName(field);

          return (
            <div
              key={field}
              className={cn(
                fieldStyle(
                  field,
                  required_fields,
                  typography,
                  index,
                ),
                !value && "opacity-60",
              )}
            >
              {displayValue}
            </div>
          );
        })}
      </div>
    </div>
  );
}