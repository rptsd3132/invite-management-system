import type { CSSProperties, ReactElement } from "react";

import { cn } from "../../lib/utils";
import { resolveTemplateImage } from "../assets/templateImages";

import {
  TEMPLATE_STYLES,
  type TemplateStyleKey,
  type TemplateVisualStyle,
} from "./templateStyles";

type OverlayMode = "full" | "minimal" | "positioned";
type TextAlign = "left" | "center" | "right";
type TextFamily = "serif" | "sans" | "mono";
type TextSize = "hero" | "xl" | "lg" | "md" | "sm" | "xs";
type ValuePart = "full" | "date" | "time";

interface PositionedText {
  x: number;
  y: number;
  width?: number;
  size?: TextSize;
  color?: string;
  align?: TextAlign;
  family?: TextFamily;
  weight?: number;
  letter_spacing?: string;
  uppercase?: boolean;
  shadow?: boolean;
  value_part?: ValuePart;
  prefix?: string;
  suffix?: string;
}

interface StaticText extends PositionedText {
  text: string;
}

interface DesignSchema {
  background_image?: string | null;
  background_position?: string;
  style_key?: TemplateStyleKey;
  category?: string;
  badge_text?: string | null;
  eyebrow_text?: string | null;
  required_fields: string[];

  overlay_mode?: OverlayMode;
  display_fields?: string[];

  aspect_ratio?: string;
  layout?: Record<string, PositionedText>;
  static_texts?: StaticText[];

  container_classes?: string;
  background?: string;
}

interface TemplateRendererProps {
  designSchema: DesignSchema;
  fieldData: Record<string, string | undefined>;
  className?: string;
}

const FALLBACK_STYLE = TEMPLATE_STYLES["wedding-botanical"];

/* =========================================================
   BASIC FIELD HELPERS
   ========================================================= */

function formatFieldName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function isMainName(field: string): boolean {
  return (
    field.includes("bride") ||
    field.includes("groom") ||
    field.includes("birthday_person")
  );
}

function isParticipant(field: string): boolean {
  return field.includes("participant");
}

function isEventName(field: string): boolean {
  return field === "event_name";
}

function isDateField(field: string): boolean {
  return field.includes("date") || field.includes("time");
}

function isLocationField(field: string): boolean {
  return field.includes("location");
}

/* =========================================================
   PREMIUM TYPOGRAPHY
   ========================================================= */

function getDynamicFieldStyle(
  field: string,
  category?: string,
): string {
  if (category === "Wedding") {
    if (isMainName(field)) {
      return cn(
        "font-serif font-semibold tracking-[0.015em]",
        "drop-shadow-[0_3px_12px_rgba(0,0,0,0.28)]",
      );
    }

    if (isParticipant(field)) {
      return "font-serif font-semibold tracking-[0.025em]";
    }

    if (isEventName(field)) {
      return "font-serif font-semibold tracking-[0.025em]";
    }

    return "font-sans font-semibold tracking-[0.005em]";
  }

  if (category === "Birthday") {
    if (isMainName(field)) {
      return cn(
        "font-serif font-bold tracking-[-0.01em]",
        "drop-shadow-[0_3px_12px_rgba(0,0,0,0.30)]",
      );
    }

    if (isParticipant(field)) {
      return "font-sans font-bold tracking-[0.02em]";
    }

    if (isEventName(field)) {
      return "font-serif font-bold tracking-[-0.01em]";
    }

    return "font-sans font-semibold tracking-[0.002em]";
  }

  if (category === "Office") {
    if (isEventName(field)) {
      return "font-sans font-extrabold tracking-[-0.025em]";
    }

    if (isParticipant(field)) {
      return "font-sans font-bold uppercase tracking-[0.10em]";
    }

    if (isDateField(field)) {
      return "font-sans font-semibold tracking-[0.002em]";
    }

    if (isLocationField(field)) {
      return "font-sans font-semibold tracking-[0.001em]";
    }
  }

  return "font-sans font-medium";
}

/* =========================================================
   SIZE SYSTEM

   Important:
   The old renderer allowed xs to shrink to around 8px.
   That is too small for an official invitation preview.

   These are now deliberately larger.
   ========================================================= */

function baseSizeClass(size: TextSize | undefined): string {
  switch (size) {
    case "hero":
      return "text-[clamp(1.65rem,5vw,2.7rem)] leading-[1.02]";
    case "xl":
      return "text-[clamp(1.4rem,4.3vw,2.2rem)] leading-[1.05]";
    case "lg":
      return "text-[clamp(1.12rem,3.5vw,1.75rem)] leading-[1.12]";
    case "md":
      return "text-[clamp(0.95rem,2.8vw,1.28rem)] leading-[1.2]";
    case "sm":
      return "text-[clamp(0.78rem,2.15vw,0.98rem)] leading-[1.35]";
    case "xs":
    default:
      return "text-[clamp(0.68rem,1.75vw,0.84rem)] leading-[1.35]";
  }
}

/*
 * Field-aware minimum sizing.
 *
 * Even if seed_templates asks for "xs", important generated values
 * never become unreadably small.
 */
function dynamicSizeClass(
  field: string,
  category: string | undefined,
  configuredSize: TextSize | undefined,
  value: string,
): string {
  const valueLength = value.trim().length;

  // Important names should look intentional and premium.
  if (isMainName(field)) {
    if (valueLength <= 12) {
      return category === "Wedding"
        ? "text-[clamp(1.3rem,4.1vw,2rem)] leading-[1.05]"
        : "text-[clamp(1.2rem,3.8vw,1.85rem)] leading-[1.05]";
    }

    return "text-[clamp(1rem,3.1vw,1.45rem)] leading-[1.08]";
  }

  // Event names need hierarchy, but long titles must still fit.
  if (isEventName(field)) {
    if (valueLength <= 22) {
      return "text-[clamp(1.05rem,3.1vw,1.5rem)] leading-[1.12]";
    }

    if (valueLength <= 34) {
      return "text-[clamp(0.92rem,2.7vw,1.25rem)] leading-[1.14]";
    }

    return "text-[clamp(0.8rem,2.25vw,1.05rem)] leading-[1.16]";
  }

  // Participant name should never look like tiny helper text.
  if (isParticipant(field)) {
    return valueLength <= 20
      ? "text-[clamp(0.78rem,2.1vw,0.98rem)] leading-[1.25]"
      : "text-[clamp(0.7rem,1.85vw,0.86rem)] leading-[1.28]";
  }

  // Date/time is operational information, so keep it readable.
  if (isDateField(field)) {
    return valueLength > 32
      ? "text-[clamp(0.64rem,1.6vw,0.78rem)] leading-[1.3]"
      : "text-[clamp(0.7rem,1.85vw,0.86rem)] leading-[1.3]";
  }

  // Locations can be long; readable but compact.
  if (isLocationField(field)) {
    return valueLength > 36
      ? "text-[clamp(0.62rem,1.55vw,0.76rem)] leading-[1.28]"
      : "text-[clamp(0.68rem,1.75vw,0.84rem)] leading-[1.3]";
  }

  return baseSizeClass(configuredSize);
}

function familyClass(family: TextFamily | undefined): string {
  if (family === "serif") return "font-serif";
  if (family === "mono") return "font-mono";
  return "font-sans";
}

/* =========================================================
   DATE / TIME SPLITTING
   ========================================================= */

function extractDatePart(value: string): string {
  const atIndex = value.toLowerCase().lastIndexOf(" at ");

  if (atIndex >= 0) {
    return value.slice(0, atIndex).trim();
  }

  const commaTimeMatch = value.match(
    /^(.*?)(?:,\s*)?(\d{1,2}:\d{2}\s*(?:AM|PM))$/i,
  );

  if (commaTimeMatch) {
    return commaTimeMatch[1].trim();
  }

  return value;
}

function extractTimePart(value: string): string {
  const atIndex = value.toLowerCase().lastIndexOf(" at ");

  if (atIndex >= 0) {
    return value.slice(atIndex + 4).trim();
  }

  const match = value.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))$/i);
  return match?.[1] ?? value;
}

function resolveDisplayedValue(
  rawValue: string,
  config: PositionedText,
): string {
  let value = rawValue;

  if (config.value_part === "date") {
    value = extractDatePart(rawValue);
  } else if (config.value_part === "time") {
    value = extractTimePart(rawValue);
  }

  return `${config.prefix ?? ""}${value}${config.suffix ?? ""}`;
}

/* =========================================================
   POSITIONING
   ========================================================= */

function makePositionStyle(config: PositionedText): CSSProperties {
  const align = config.align ?? "center";

  return {
    left: `${config.x}%`,
    top: `${config.y}%`,
    width: `${config.width ?? 70}%`,
    color: config.color ?? "#ffffff",
    textAlign: align,
    fontWeight: config.weight ?? 500,
    letterSpacing: config.letter_spacing ?? "0em",
    overflowWrap: "anywhere",
    transform:
      align === "center"
        ? "translate(-50%, -50%)"
        : align === "right"
          ? "translate(-100%, -50%)"
          : "translate(0, -50%)",
    textShadow:
      config.shadow === false
        ? "none"
        : "0 2px 10px rgba(0,0,0,0.38)",
  };
}

/* =========================================================
   POSITIONED LAYER
   ========================================================= */

function PositionedLayer({
  designSchema,
  fieldData,
}: {
  designSchema: DesignSchema;
  fieldData: Record<string, string | undefined>;
}): ReactElement {
  const layout = designSchema.layout ?? {};
  const staticTexts = designSchema.static_texts ?? [];

  return (
    <div className="absolute inset-0 z-20">
      {Object.entries(layout).map(([layoutKey, config]) => {
        const field = layoutKey.split("__")[0];
        const rawValue = fieldData[field];

        if (!rawValue) return null;

        const value = resolveDisplayedValue(rawValue, config);

        return (
          <div
            key={layoutKey}
            className={cn(
              "absolute break-words",
              "transition-all duration-300",
              dynamicSizeClass(
                field,
                designSchema.category,
                config.size,
                value,
              ),
              getDynamicFieldStyle(field, designSchema.category),
              config.uppercase && "uppercase",
            )}
            style={makePositionStyle(config)}
          >
            {value}
          </div>
        );
      })}

      {staticTexts.map((item, index) => (
        <div
          key={`${item.text}-${index}`}
          className={cn(
            "absolute select-none",
            baseSizeClass(item.size),
            familyClass(item.family),
            item.uppercase && "uppercase",
          )}
          style={makePositionStyle(item)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   LEGACY FULL-OVERLAY SUPPORT
   ========================================================= */

function getFieldClass(
  field: string,
  index: number,
  style: TemplateVisualStyle,
): string {
  const nameField = isMainName(field) || isParticipant(field);
  const dateOrLocation = isDateField(field) || isLocationField(field);

  if (index === 0) return style.title;
  if (nameField) return style.accent;
  if (dateOrLocation) return style.body;
  return style.accent;
}

function Decorations({
  type,
}: {
  type: TemplateVisualStyle["decoration"];
}): ReactElement | null {
  if (type === "none") return null;

  if (type === "floral") {
    return (
      <>
        <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-rose-200/20 blur-2xl" />
      </>
    );
  }

  if (type === "sparkle") {
    return (
      <>
        <span className="pointer-events-none absolute left-8 top-10 text-xl text-amber-100/80">
          ✦
        </span>
        <span className="pointer-events-none absolute right-8 top-16 text-sm text-white/70">
          ✧
        </span>
      </>
    );
  }

  if (type === "geometry") {
    return (
      <>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rotate-12 rounded-[36px] border border-white/15" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 -rotate-12 rounded-full border border-white/15" />
      </>
    );
  }

  return null;
}

function FullOverlay({
  designSchema,
  fieldData,
  style,
}: {
  designSchema: DesignSchema;
  fieldData: Record<string, string | undefined>;
  style: TemplateVisualStyle;
}): ReactElement {
  const fields =
    designSchema.display_fields?.length
      ? designSchema.display_fields
      : designSchema.required_fields ?? [];

  return (
    <>
      <Decorations type={style.decoration} />

      <div
        className={cn(
          "pointer-events-none absolute inset-4 rounded-[25px]",
          style.frameOuter,
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-7 rounded-[21px]",
          style.frameInner,
        )}
      />

      {designSchema.badge_text && (
        <div className="absolute left-1/2 top-7 z-20 -translate-x-1/2">
          <span
            className={cn(
              "inline-flex whitespace-nowrap rounded-full px-3.5 py-1.5",
              "text-[9px] font-semibold uppercase tracking-[0.24em] shadow-sm",
              style.label,
            )}
          >
            {designSchema.badge_text}
          </span>
        </div>
      )}

      <div
        className={cn(
          "relative z-10 flex h-full w-full px-6 py-10 sm:px-8 sm:py-12",
          style.alignment,
        )}
      >
        <div
          className={cn(
            "w-full max-w-[92%] rounded-[26px] px-5 py-7",
            "sm:max-w-[88%] sm:px-7 sm:py-9",
            style.panel,
          )}
        >
          {designSchema.eyebrow_text && (
            <p
              className={cn(
                "mb-3 text-[9px] font-semibold uppercase tracking-[0.34em]",
                style.eyebrow,
              )}
            >
              {designSchema.eyebrow_text}
            </p>
          )}

          <div
            className={cn(
              "mx-auto mb-4 h-px w-10",
              style.divider,
            )}
          />

          <div className="space-y-2.5 sm:space-y-3.5">
            {fields.map((field, index) => {
              const value = fieldData[field];

              return (
                <div
                  key={field}
                  className={cn(
                    getFieldClass(field, index, style),
                    getDynamicFieldStyle(field, designSchema.category),
                    "break-words",
                    !value && "opacity-65",
                  )}
                >
                  {value || formatFieldName(field)}
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "mx-auto mt-4 h-px w-10",
              style.divider,
            )}
          />
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN
   ========================================================= */

export function TemplateRenderer({
  designSchema,
  fieldData,
  className,
}: TemplateRendererProps): ReactElement {
  const style = designSchema.style_key
    ? TEMPLATE_STYLES[designSchema.style_key] ?? FALLBACK_STYLE
    : FALLBACK_STYLE;

  const backgroundImage = resolveTemplateImage(
    designSchema.background_image,
  );

  const positionedMode =
    designSchema.overlay_mode === "positioned" &&
    Boolean(designSchema.layout);

  return (
    <div
      className={cn(
        "group relative isolate mx-auto w-full max-w-md overflow-hidden rounded-[30px]",
        "border border-white/30",
        "shadow-[0_26px_80px_rgba(15,23,42,0.22)]",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1",
        "hover:shadow-[0_34px_100px_rgba(15,23,42,0.30)]",
        style.root,
        designSchema.background,
        designSchema.container_classes,
        className,
      )}
      style={{
        aspectRatio: designSchema.aspect_ratio ?? "3 / 4",
      }}
    >
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full",
            positionedMode ? "object-contain" : "object-cover",
          )}
          style={{
            objectPosition: designSchema.background_position ?? "center",
          }}
        />
      )}

      {positionedMode ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.015] via-transparent to-black/[0.025]" />

          <div className="pointer-events-none absolute inset-[1px] rounded-[29px] ring-1 ring-inset ring-white/10" />

          <PositionedLayer
            designSchema={designSchema}
            fieldData={fieldData}
          />
        </>
      ) : (
        <>
          <div className={cn("absolute inset-0", style.overlay)} />

          <FullOverlay
            designSchema={designSchema}
            fieldData={fieldData}
            style={style}
          />
        </>
      )}
    </div>
  );
}