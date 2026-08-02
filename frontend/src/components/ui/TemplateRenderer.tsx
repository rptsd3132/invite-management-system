import type { ReactElement } from "react";
import { cn } from "../../lib/utils";
import { resolveTemplateImage } from "../assets/templateImages";
import {
  TEMPLATE_STYLES,
  type TemplateStyleKey,
  type TemplateVisualStyle,
} from "./templateStyles";

interface DesignSchema {
  background_image?: string | null;
  background_position?: string;
  style_key?: TemplateStyleKey;
  category?: string;
  badge_text?: string;
  eyebrow_text?: string;
  required_fields: string[];
  container_classes?: string;
  background?: string;
}

interface TemplateRendererProps {
  designSchema: DesignSchema;
  fieldData: Record<string, string | undefined>;
  className?: string;
}

const FALLBACK_STYLE = TEMPLATE_STYLES["wedding-botanical"];

function formatFieldName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getFieldClass(
  field: string,
  index: number,
  style: TemplateVisualStyle,
): string {
  const isName =
    field.includes("bride") ||
    field.includes("groom") ||
    field.includes("birthday_person") ||
    field.includes("participant");
  const isDateOrLocation =
    field.includes("date") || field.includes("time") || field.includes("location");

  if (index === 0) return style.title;
  if (isName) return style.accent;
  if (isDateOrLocation) return style.body;
  return style.accent;
}

function Decorations({ type }: { type: TemplateVisualStyle["decoration"] }): ReactElement | null {
  if (type === "none") return null;

  if (type === "floral") {
    return (
      <>
        <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-white/20 blur-2xl transition-transform duration-700 group-hover:scale-110" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-rose-200/20 blur-2xl transition-transform duration-700 group-hover:scale-110" />
        <span className="pointer-events-none absolute left-7 top-8 text-xl text-white/75">✦</span>
        <span className="pointer-events-none absolute bottom-8 right-8 text-lg text-amber-100/75">✧</span>
      </>
    );
  }

  if (type === "sparkle") {
    return (
      <>
        <span className="pointer-events-none absolute left-8 top-10 text-xl text-amber-100/80 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">✦</span>
        <span className="pointer-events-none absolute right-8 top-16 text-sm text-white/70">✧</span>
        <span className="pointer-events-none absolute bottom-12 left-10 text-sm text-amber-100/70">✧</span>
      </>
    );
  }

  if (type === "geometry") {
    return (
      <>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rotate-12 rounded-[36px] border border-white/15 transition-transform duration-700 group-hover:rotate-[18deg]" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 -rotate-12 rounded-full border border-white/15 transition-transform duration-700 group-hover:-rotate-[18deg]" />
      </>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <span className="absolute left-[12%] top-[10%] h-2.5 w-2.5 rotate-45 rounded-sm bg-yellow-200 shadow-sm transition-transform duration-700 group-hover:translate-y-1" />
      <span className="absolute right-[13%] top-[17%] h-3 w-3 rounded-full bg-pink-300 shadow-sm transition-transform duration-700 group-hover:-translate-y-1" />
      <span className="absolute bottom-[18%] left-[15%] h-2 w-5 rotate-45 rounded-full bg-cyan-200 shadow-sm" />
      <span className="absolute bottom-[12%] right-[14%] h-3.5 w-3.5 rotate-12 rounded-sm bg-purple-200 shadow-sm" />
      <span className="absolute left-[8%] top-[50%] h-2 w-2 rounded-full bg-emerald-200" />
      <span className="absolute right-[8%] top-[44%] h-2 w-4 -rotate-45 rounded-full bg-orange-200" />
    </div>
  );
}

export function TemplateRenderer({
  designSchema,
  fieldData,
  className,
}: TemplateRendererProps): ReactElement {
  const style = designSchema.style_key
    ? TEMPLATE_STYLES[designSchema.style_key] ?? FALLBACK_STYLE
    : FALLBACK_STYLE;
  const backgroundImage = resolveTemplateImage(designSchema.background_image);
  const fields = designSchema.required_fields ?? [];

  return (
    <div
      className={cn(
        "group relative isolate mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[30px]",
        "shadow-[0_24px_70px_rgba(15,23,42,0.24)] transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_34px_100px_rgba(15,23,42,0.32)]",
        style.root,
        designSchema.background,
        designSchema.container_classes,
        className,
      )}
    >
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out motion-safe:group-hover:scale-[1.06]"
          style={{ objectPosition: designSchema.background_position ?? "center" }}
        />
      )}

      <div className={cn("absolute inset-0", style.overlay)} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-80" />

      <Decorations type={style.decoration} />

      <div className={cn("pointer-events-none absolute inset-4 rounded-[25px]", style.frameOuter)} />
      <div className={cn("pointer-events-none absolute inset-7 rounded-[21px]", style.frameInner)} />

      <div className="absolute left-1/2 top-7 z-20 -translate-x-1/2">
        <span
          className={cn(
            "inline-flex whitespace-nowrap rounded-full px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] shadow-sm",
            style.label,
          )}
        >
          {designSchema.badge_text ?? designSchema.category ?? "Invitation"}
        </span>
      </div>

      <div className={cn("relative z-10 flex h-full w-full px-6 py-10 sm:px-8 sm:py-12", style.alignment)}>
        <div
          className={cn(
            "w-full max-w-[92%] rounded-[26px] px-5 py-7 sm:max-w-[88%] sm:px-7 sm:py-9",
            "transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-1",
            style.panel,
          )}
        >
          {designSchema.eyebrow_text && (
            <p className={cn("mb-3 text-[9px] font-semibold uppercase tracking-[0.34em] sm:text-[10px]", style.eyebrow)}>
              {designSchema.eyebrow_text}
            </p>
          )}

          <div className={cn("mx-auto mb-4 h-px w-10 sm:mb-5 sm:w-12", style.divider)} />

          <div className="space-y-2.5 sm:space-y-3.5">
            {fields.map((field, index) => {
              const value = fieldData[field];
              return (
                <div
                  key={field}
                  className={cn(
                    getFieldClass(field, index, style),
                    "break-words drop-shadow-sm",
                    !value && "opacity-65",
                  )}
                >
                  {value || formatFieldName(field)}
                </div>
              );
            })}
          </div>

          <div className={cn("mx-auto mt-4 h-px w-10 sm:mt-5 sm:w-12", style.divider)} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
}
