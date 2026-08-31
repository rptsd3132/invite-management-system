import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  CSSProperties,
  ReactElement,
} from "react";

import { cn } from "../../lib/utils";
import { resolveTemplateImage } from "../templates/templateImages";
import type { InvitationLanguage } from "../../lib/invitationLanguage";

import {
  TEMPLATE_STYLES,
  type TemplateStyleKey,
  type TemplateVisualStyle,
} from "./templateStyles";


/* =========================================================
   TYPES
   ========================================================= */

type OverlayMode =
  | "full"
  | "minimal"
  | "positioned";

type TextAlign =
  | "left"
  | "center"
  | "right";

type TextFamily =
  | "serif"
  | "sans"
  | "mono";

type TextSize =
  | "hero"
  | "xl"
  | "lg"
  | "md"
  | "sm"
  | "xs";

type ValuePart =
  | "full"
  | "date"
  | "time";

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
  language?: InvitationLanguage;
  className?: string;
}

const FALLBACK_STYLE =
  TEMPLATE_STYLES["wedding-botanical"];


/* =========================================================
   FIELD HELPERS
   ========================================================= */

function formatFieldName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function isMainName(field: string): boolean {
  return (
    field.includes("bride") ||
    field.includes("groom") ||
    field.includes("birthday_person")
  );
}

function isWeddingName(field: string): boolean {
  return (
    field.includes("bride") ||
    field.includes("groom")
  );
}

function isBirthdayName(field: string): boolean {
  return field.includes("birthday_person");
}

function isParticipant(field: string): boolean {
  return field.includes("participant");
}

function isEventName(field: string): boolean {
  return field === "event_name";
}

function isDateField(field: string): boolean {
  return (
    field.includes("date") ||
    field.includes("time")
  );
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
        "font-serif",
        "font-semibold",
        "tracking-[0.015em]",
        "drop-shadow-[0_3px_12px_rgba(0,0,0,0.25)]",
      );
    }

    if (isParticipant(field)) {
      return cn(
        "font-serif",
        "font-semibold",
        "tracking-[0.03em]",
      );
    }

    if (isEventName(field)) {
      return cn(
        "font-serif",
        "font-semibold",
        "tracking-[0.035em]",
      );
    }

    return cn(
      "font-sans",
      "font-semibold",
      "tracking-[0.003em]",
    );
  }

  if (category === "Birthday") {
    if (isBirthdayName(field)) {
      return cn(
        "font-serif",
        "font-bold",
        "tracking-[-0.015em]",
        "drop-shadow-[0_3px_12px_rgba(0,0,0,0.28)]",
      );
    }

    if (isParticipant(field)) {
      return cn(
        "font-sans",
        "font-bold",
        "tracking-[0.025em]",
      );
    }

    if (isEventName(field)) {
      return cn(
        "font-serif",
        "font-bold",
        "tracking-[-0.012em]",
      );
    }

    return cn(
      "font-sans",
      "font-semibold",
      "tracking-[0.002em]",
    );
  }

  if (category === "Office") {
    if (isEventName(field)) {
      return cn(
        "font-sans",
        "font-extrabold",
        "tracking-[-0.025em]",
      );
    }

    if (isParticipant(field)) {
      return cn(
        "font-sans",
        "font-bold",
        "uppercase",
        "tracking-[0.10em]",
      );
    }

    if (isDateField(field)) {
      return cn(
        "font-sans",
        "font-semibold",
      );
    }

    if (isLocationField(field)) {
      return cn(
        "font-sans",
        "font-semibold",
      );
    }
  }

  return "font-sans font-medium";
}


/* =========================================================
   BASE SIZE SYSTEM
   ========================================================= */

function baseSizeClass(
  size: TextSize | undefined,
): string {
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

function familyClass(
  family: TextFamily | undefined,
): string {
  if (family === "serif") {
    return "font-serif";
  }

  if (family === "mono") {
    return "font-mono";
  }

  return "font-sans";
}


/* =========================================================
   AUTO-FIT ENGINE
   ========================================================= */

function getAutoFitBounds(
  field: string,
  category: string | undefined,
  configuredSize: TextSize | undefined,
): {
  min: number;
  max: number;
  lineHeight: number;
  maxLines: number;
} {
  if (isMainName(field)) {
    return {
      min: 15,
      max: category === "Wedding" ? 38 : 34,
      lineHeight: 1.05,
      maxLines: 2,
    };
  }

  if (isEventName(field)) {
    return {
      min: 13,
      max: category === "Office" ? 29 : 31,
      lineHeight: 1.08,
      maxLines: 3,
    };
  }

  if (isParticipant(field)) {
    return {
      min: 11,
      max: 20,
      lineHeight: 1.15,
      maxLines: 2,
    };
  }

  if (isDateField(field)) {
    return {
      min: 10,
      max: 17,
      lineHeight: 1.2,
      maxLines: 2,
    };
  }

  if (isLocationField(field)) {
    return {
      min: 10,
      max: 16,
      lineHeight: 1.2,
      maxLines: 3,
    };
  }

  switch (configuredSize) {
    case "hero":
      return {
        min: 15,
        max: 38,
        lineHeight: 1.05,
        maxLines: 2,
      };

    case "xl":
      return {
        min: 14,
        max: 32,
        lineHeight: 1.08,
        maxLines: 2,
      };

    case "lg":
      return {
        min: 13,
        max: 27,
        lineHeight: 1.12,
        maxLines: 2,
      };

    case "md":
      return {
        min: 12,
        max: 21,
        lineHeight: 1.16,
        maxLines: 2,
      };

    case "sm":
      return {
        min: 10,
        max: 17,
        lineHeight: 1.2,
        maxLines: 2,
      };

    case "xs":
    default:
      return {
        min: 9,
        max: 15,
        lineHeight: 1.2,
        maxLines: 2,
      };
  }
}


/* =========================================================
   TEXT COMPOSITION HELPERS
   ========================================================= */

function splitWords(value: string): string[] {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function splitBalanced(
  value: string,
): [string, string] {
  const words = splitWords(value);

  if (words.length <= 1) {
    return [value, ""];
  }

  let bestIndex = 1;
  let bestDifference = Number.POSITIVE_INFINITY;

  for (
    let index = 1;
    index < words.length;
    index += 1
  ) {
    const first = words
      .slice(0, index)
      .join(" ");

    const second = words
      .slice(index)
      .join(" ");

    const difference = Math.abs(
      first.length -
        second.length,
    );

    if (
      difference <
      bestDifference
    ) {
      bestDifference =
        difference;

      bestIndex =
        index;
    }
  }

  return [
    words
      .slice(0, bestIndex)
      .join(" "),

    words
      .slice(bestIndex)
      .join(" "),
  ];
}

function splitOfficeTitle(
  value: string,
): string[] {
  const words =
    splitWords(value);

  if (words.length <= 2) {
    return [value];
  }

  if (words.length === 3) {
    return [
      words.slice(0, 2).join(" "),
      words[2],
    ];
  }

  if (words.length === 4) {
    return [
      words.slice(0, 2).join(" "),
      words.slice(2).join(" "),
    ];
  }

  const lines: string[] = [];

  let current = "";

  for (const word of words) {
    const candidate =
      current
        ? `${current} ${word}`
        : word;

    if (
      candidate.length > 20 &&
      current
    ) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  if (lines.length <= 3) {
    return lines;
  }

  return [
    lines[0],
    lines[1],
    lines
      .slice(2)
      .join(" "),
  ];
}


/* =========================================================
   AUTO COMPOSITION
   ========================================================= */

function AutoComposition({
  value,
  field,
  category,
}: {
  value: string;
  field: string;
  category?: string;
}): ReactElement {
  /*
   * OFFICE EVENT TITLE
   *
   * Instead of:
   * Annual Innovation
   * Summit 2026
   *
   * it gets hierarchy:
   *
   * ANNUAL INNOVATION
   * Summit 2026
   */
  if (
    category === "Office" &&
    isEventName(field)
  ) {
    const lines =
      splitOfficeTitle(value);

    return (
      <span className="block w-full text-balance">
        {lines.map(
          (line, index) => (
            <span
              key={`${line}-${index}`}
              className={cn(
                "block",
                index ===
                  lines.length - 1
                  ? [
                      "mt-[0.05em]",
                      "text-[1.12em]",
                      "font-extrabold",
                      "tracking-[-0.035em]",
                    ]
                  : [
                      "text-[0.78em]",
                      "font-bold",
                      "uppercase",
                      "tracking-[0.08em]",
                    ],
              )}
            >
              {line}
            </span>
          ),
        )}
      </span>
    );
  }


  /*
   * WEDDING NAME
   *
   * Long name is balanced naturally.
   *
   * Kavin Nilmini
   *
   * becomes visually:
   *
   * Kavin
   * Nilmini
   *
   * but only when the text actually needs it.
   */
  if (
    category === "Wedding" &&
    isWeddingName(field)
  ) {
    const words =
      splitWords(value);

    if (
      words.length >= 2 &&
      value.length > 12
    ) {
      const [
        firstLine,
        secondLine,
      ] = splitBalanced(
        value,
      );

      return (
        <span className="block w-full">
          <span className="block">
            {firstLine}
          </span>

          {secondLine && (
            <span
              className="
                mt-[0.02em]
                block
                text-[0.96em]
              "
            >
              {secondLine}
            </span>
          )}
        </span>
      );
    }

    return (
      <span className="block w-full">
        {value}
      </span>
    );
  }


  /*
   * BIRTHDAY PERSON NAME
   *
   * Gives the name a clean
   * celebration-title feel.
   */
  if (
    category === "Birthday" &&
    isBirthdayName(field)
  ) {
    const words =
      splitWords(value);

    if (
      words.length >= 2 &&
      value.length > 13
    ) {
      const [
        firstLine,
        secondLine,
      ] = splitBalanced(
        value,
      );

      return (
        <span className="block w-full">
          <span className="block">
            {firstLine}
          </span>

          {secondLine && (
            <span
              className="
                block
                text-[0.9em]
                italic
              "
            >
              {secondLine}
            </span>
          )}
        </span>
      );
    }

    return (
      <span className="block w-full">
        {value}
      </span>
    );
  }


  /*
   * PARTICIPANT
   */
  if (
    isParticipant(field)
  ) {
    return (
      <span className="block w-full text-balance">
        {value}
      </span>
    );
  }


  /*
   * DATE / LOCATION
   */
  return (
    <span className="block w-full text-balance">
      {value}
    </span>
  );
}


/* =========================================================
   AUTO-FIT TEXT COMPONENT
   ========================================================= */

function AutoFitText({
  value,
  field,
  category,
  config,
}: {
  value: string;
  field: string;
  category?: string;
  config: PositionedText;
}): ReactElement {
  const ref =
    useRef<HTMLDivElement>(
      null,
    );

  const bounds =
    useMemo(
      () =>
        getAutoFitBounds(
          field,
          category,
          config.size,
        ),
      [
        field,
        category,
        config.size,
      ],
    );

  const [
    fontSize,
    setFontSize,
  ] = useState(
    bounds.max,
  );


  useLayoutEffect(
    () => {
      const element =
        ref.current;

      if (!element) {
        return;
      }

      const fit =
        (): void => {
          const availableWidth =
            element.clientWidth;

          if (
            availableWidth <=
            0
          ) {
            return;
          }

          let low =
            bounds.min;

          let high =
            bounds.max;

          let best =
            bounds.min;


          /*
           * We dynamically test the
           * rendered composition,
           * not only string length.
           */
          for (
            let step = 0;
            step < 14;
            step += 1
          ) {
            const mid =
              (low + high) /
              2;

            element.style.fontSize =
              `${mid}px`;

            element.style.lineHeight =
              String(
                bounds.lineHeight,
              );

            const maxHeight =
              mid *
              bounds.lineHeight *
              bounds.maxLines;

            const fitsWidth =
              element.scrollWidth <=
              availableWidth + 1;

            const fitsHeight =
              element.scrollHeight <=
              maxHeight + 2;

            if (
              fitsWidth &&
              fitsHeight
            ) {
              best =
                mid;

              low =
                mid;
            } else {
              high =
                mid;
            }
          }

          setFontSize(
            Math.floor(
              best * 10,
            ) / 10,
          );
        };


      fit();

      const observer =
        new ResizeObserver(
          fit,
        );

      observer.observe(
        element,
      );

      return () =>
        observer.disconnect();
    },
    [
      value,
      field,
      category,
      config.width,
      config.size,
      bounds.min,
      bounds.max,
      bounds.lineHeight,
      bounds.maxLines,
    ],
  );


  return (
    <div
      ref={ref}
      className={cn(
        "w-full",
        "max-w-full",

        getDynamicFieldStyle(
          field,
          category,
        ),

        config.uppercase &&
          "uppercase",
      )}
      style={{
        fontSize:
          `${fontSize}px`,

        lineHeight:
          bounds.lineHeight,

        whiteSpace:
          "normal",

        wordBreak:
          "normal",

        overflowWrap:
          "normal",

        hyphens:
          "none",
      }}
    >
      <AutoComposition
        value={value}
        field={field}
        category={category}
      />
    </div>
  );
}


/* =========================================================
   DATE / TIME SPLIT
   ========================================================= */

function extractDatePart(
  value: string,
): string {
  const atIndex =
    value
      .toLowerCase()
      .lastIndexOf(
        " at ",
      );

  if (
    atIndex >= 0
  ) {
    return value
      .slice(
        0,
        atIndex,
      )
      .trim();
  }

  const match =
    value.match(
      /^(.*?)(?:,\s*)?(\d{1,2}:\d{2}\s*(?:AM|PM))$/i,
    );

  if (match) {
    return match[
      1
    ].trim();
  }

  return value;
}


function extractTimePart(
  value: string,
): string {
  const atIndex =
    value
      .toLowerCase()
      .lastIndexOf(
        " at ",
      );

  if (
    atIndex >= 0
  ) {
    return value
      .slice(
        atIndex + 4,
      )
      .trim();
  }

  const match =
    value.match(
      /(\d{1,2}:\d{2}\s*(?:AM|PM))$/i,
    );

  return (
    match?.[1] ??
    value
  );
}


function resolveDisplayedValue(
  rawValue: string,
  config: PositionedText,
): string {
  let value =
    rawValue;

  if (
    config.value_part ===
    "date"
  ) {
    value =
      extractDatePart(
        rawValue,
      );
  }

  if (
    config.value_part ===
    "time"
  ) {
    value =
      extractTimePart(
        rawValue,
      );
  }

  return `${config.prefix ?? ""}${value}${config.suffix ?? ""}`;
}


/* =========================================================
   POSITIONING
   ========================================================= */

function makePositionStyle(
  config: PositionedText,
  language: InvitationLanguage = "en",
): CSSProperties {
  const align =
    config.align ??
    "center";

  return {
    left:
      `${config.x}%`,

    top:
      `${config.y}%`,

    width:
      `${config.width ?? 70}%`,

    color:
      config.color ??
      "#ffffff",

    textAlign:
      align,

    fontWeight:
      config.weight ??
      500,

    letterSpacing:
      language === "si"
        ? "0em"
        : config.letter_spacing ?? "0em",

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
   POSITIONED PREMIUM LAYER
   ========================================================= */

function PositionedLayer({
  designSchema,
  fieldData,
  language,
}: {
  designSchema: DesignSchema;

  fieldData: Record<
    string,
    string | undefined
  >;

  language: InvitationLanguage;
}): ReactElement {
  const layout =
    designSchema.layout ??
    {};

  const staticTexts =
    designSchema.static_texts ??
    [];


  return (
    <div className="absolute inset-0 z-20">
      {Object.entries(
        layout,
      ).map(
        ([
          layoutKey,
          config,
        ]) => {
          /*
           * Supports:
           *
           * event_date_time
           *
           * and:
           *
           * event_date_time__date
           * event_date_time__time
           */

          const field =
            layoutKey.split(
              "__",
            )[0];

          const rawValue =
            fieldData[
              field
            ];

          if (
            !rawValue
          ) {
            return null;
          }

          const value =
            resolveDisplayedValue(
              rawValue,
              config,
            );


          return (
            <div
              key={
                layoutKey
              }
              className="
                absolute
                transition-all
                duration-300
              "
              style={
                makePositionStyle(
                  config,
                  language,
                )
              }
            >
              <AutoFitText
                value={
                  value
                }
                field={
                  field
                }
                category={
                  designSchema.category
                }
                config={
                  config
                }
              />
            </div>
          );
        },
      )}


      {staticTexts.map(
        (
          item,
          index,
        ) => (
          <div
            key={`${item.text}-${index}`}
            className={cn(
              "absolute",
              "select-none",

              baseSizeClass(
                item.size,
              ),

              familyClass(
                item.family,
              ),

              item.uppercase &&
                "uppercase",
            )}
            style={
              makePositionStyle(
                item,
                language,
              )
            }
          >
            {
              item.text
            }
          </div>
        ),
      )}
    </div>
  );
}


/* =========================================================
   FALLBACK DECORATIONS
   ========================================================= */

function Decorations({
  type,
}: {
  type: TemplateVisualStyle[
    "decoration"
  ];
}): ReactElement | null {
  if (
    type === "none"
  ) {
    return null;
  }

  if (
    type === "floral"
  ) {
    return (
      <>
        <div
          className="
            pointer-events-none
            absolute
            -left-10
            -top-10
            h-36
            w-36
            rounded-full
            bg-white/20
            blur-2xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-12
            -right-12
            h-40
            w-40
            rounded-full
            bg-rose-200/20
            blur-2xl
          "
        />
      </>
    );
  }

  if (
    type === "sparkle"
  ) {
    return (
      <>
        <span
          className="
            pointer-events-none
            absolute
            left-8
            top-10
            text-xl
            text-amber-100/80
          "
        >
          ✦
        </span>

        <span
          className="
            pointer-events-none
            absolute
            right-8
            top-16
            text-sm
            text-white/70
          "
        >
          ✧
        </span>
      </>
    );
  }

  if (
    type === "geometry"
  ) {
    return (
      <>
        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-44
            w-44
            rotate-12
            rounded-[36px]
            border
            border-white/15
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-12
            -left-12
            h-36
            w-36
            -rotate-12
            rounded-full
            border
            border-white/15
          "
        />
      </>
    );
  }

  return null;
}


/* =========================================================
   FULL OVERLAY FALLBACK
   ========================================================= */

function getFieldClass(
  field: string,
  index: number,
  style: TemplateVisualStyle,
): string {
  const nameField =
    isMainName(field) ||
    isParticipant(field);

  const dateOrLocation =
    isDateField(field) ||
    isLocationField(field);

  if (
    index === 0
  ) {
    return style.title;
  }

  if (
    nameField
  ) {
    return style.accent;
  }

  if (
    dateOrLocation
  ) {
    return style.body;
  }

  return style.accent;
}


function FullOverlay({
  designSchema,
  fieldData,
  style,
}: {
  designSchema: DesignSchema;

  fieldData: Record<
    string,
    string | undefined
  >;

  style: TemplateVisualStyle;
}): ReactElement {
  const fields =
    designSchema
      .display_fields
      ?.length
      ? designSchema
          .display_fields
      : designSchema
          .required_fields ??
        [];


  return (
    <>
      <Decorations
        type={
          style.decoration
        }
      />

      <div
        className={cn(
          "pointer-events-none",
          "absolute",
          "inset-4",
          "rounded-[25px]",

          style.frameOuter,
        )}
      />

      <div
        className={cn(
          "pointer-events-none",
          "absolute",
          "inset-7",
          "rounded-[21px]",

          style.frameInner,
        )}
      />

      {designSchema.badge_text && (
        <div
          className="
            absolute
            left-1/2
            top-7
            z-20
            -translate-x-1/2
          "
        >
          <span
            className={cn(
              "inline-flex",
              "whitespace-nowrap",
              "rounded-full",
              "px-3.5",
              "py-1.5",

              "text-[9px]",
              "font-semibold",
              "uppercase",
              "tracking-[0.24em]",
              "shadow-sm",

              style.label,
            )}
          >
            {
              designSchema.badge_text
            }
          </span>
        </div>
      )}


      <div
        className={cn(
          "relative",
          "z-10",
          "flex",
          "h-full",
          "w-full",
          "px-6",
          "py-10",
          "sm:px-8",
          "sm:py-12",

          style.alignment,
        )}
      >
        <div
          className={cn(
            "w-full",
            "max-w-[92%]",
            "rounded-[26px]",
            "px-5",
            "py-7",

            "sm:max-w-[88%]",
            "sm:px-7",
            "sm:py-9",

            style.panel,
          )}
        >
          {designSchema.eyebrow_text && (
            <p
              className={cn(
                "mb-3",
                "text-[9px]",
                "font-semibold",
                "uppercase",
                "tracking-[0.34em]",

                style.eyebrow,
              )}
            >
              {
                designSchema.eyebrow_text
              }
            </p>
          )}


          <div
            className={cn(
              "mx-auto",
              "mb-4",
              "h-px",
              "w-10",

              style.divider,
            )}
          />


          <div className="space-y-2.5 sm:space-y-3.5">
            {fields.map(
              (
                field,
                index,
              ) => {
                const value =
                  fieldData[
                    field
                  ];


                return (
                  <div
                    key={
                      field
                    }
                    className={cn(
                      getFieldClass(
                        field,
                        index,
                        style,
                      ),

                      getDynamicFieldStyle(
                        field,
                        designSchema.category,
                      ),

                      "break-words",

                      !value &&
                        "opacity-65",
                    )}
                  >
                    {value ? (
                      <AutoComposition
                        value={
                          value
                        }
                        field={
                          field
                        }
                        category={
                          designSchema.category
                        }
                      />
                    ) : (
                      formatFieldName(
                        field,
                      )
                    )}
                  </div>
                );
              },
            )}
          </div>


          <div
            className={cn(
              "mx-auto",
              "mt-4",
              "h-px",
              "w-10",

              style.divider,
            )}
          />
        </div>
      </div>
    </>
  );
}


/* =========================================================
   MAIN RENDERER
   ========================================================= */

export function TemplateRenderer({
  designSchema,
  fieldData,
  language = "en",
  className,
}: TemplateRendererProps): ReactElement {
  const style =
    designSchema.style_key
      ? TEMPLATE_STYLES[
          designSchema
            .style_key
        ] ??
        FALLBACK_STYLE
      : FALLBACK_STYLE;


  const backgroundImage =
    resolveTemplateImage(
      designSchema
        .background_image,
    );


  const positionedMode =
    designSchema.overlay_mode ===
      "positioned" &&
    Boolean(
      designSchema.layout,
    );


  return (
    <div
      lang={language === "si" ? "si" : "en"}
      className={cn(
        "group",
        "relative",
        "isolate",
        "mx-auto",
        "w-full",
        "max-w-md",
        "overflow-hidden",
        "rounded-[30px]",

        "border",
        "border-white/30",

        "shadow-[0_26px_80px_rgba(15,23,42,0.22)]",

        "transition-all",
        "duration-500",
        "ease-out",

        "hover:-translate-y-1",

        "hover:shadow-[0_34px_100px_rgba(15,23,42,0.30)]",

        style.root,

        designSchema.background,

        designSchema.container_classes,

        className,
      )}
      style={{
        aspectRatio:
          designSchema
            .aspect_ratio ??
          "3 / 4",
        fontFamily:
          language === "si"
            ? '"Noto Sans Sinhala", "Noto Sans", system-ui, sans-serif'
            : undefined,
      }}
    >
      {backgroundImage && (
        <img
          src={
            backgroundImage
          }
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute",
            "inset-0",
            "h-full",
            "w-full",

            positionedMode
              ? "object-contain"
              : "object-cover",
          )}
          style={{
            objectPosition:
              designSchema
                .background_position ??
              "center",
          }}
        />
      )}


      {positionedMode ? (
        <>
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-br
              from-white/[0.015]
              via-transparent
              to-black/[0.025]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-[1px]
              rounded-[29px]
              ring-1
              ring-inset
              ring-white/10
            "
          />


          <PositionedLayer
            designSchema={
              designSchema
            }
            fieldData={
              fieldData
            }
            language={
              language
            }
          />
        </>
      ) : (
        <>
          <div
            className={cn(
              "absolute",
              "inset-0",

              style.overlay,
            )}
          />


          <FullOverlay
            designSchema={
              designSchema
            }
            fieldData={
              fieldData
            }
            style={
              style
            }
          />
        </>
      )}
    </div>
  );
}