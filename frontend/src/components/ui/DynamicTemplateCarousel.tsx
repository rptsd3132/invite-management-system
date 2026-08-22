import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { TemplateRenderer } from "./TemplateRenderer";
import type { Template } from "../../types";

interface DynamicTemplateCarouselProps {
  templates: Template[];
  interval?: number;
  className?: string;
}

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

function TemplateCard({
  template,
  position,
}: {
  template: Template;
  position: "top-right" | "bottom-left";
}): React.ReactElement {
  const isTopRight = position === "top-right";

  return (
    <div
      className={cn(
        "absolute rounded-2xl shadow-2xl border border-white/60 overflow-hidden",
        "transition-all duration-700 ease-in-out",
        isTopRight
          ? "-top-4 -right-4 sm:top-2 sm:right-6 z-10 -rotate-[30deg]"
          : "-bottom-6 -left-4 sm:bottom-2 sm:left-6 z-20 rotate-[30deg]",
      )}
    >
      <div className="w-[320px] h-[460px] transform scale-[0.55] sm:scale-[0.65] origin-center pointer-events-none">
        <TemplateRenderer
          designSchema={template.design_schema}
          fieldData={getSampleFieldData(template.category)}
        />
      </div>
    </div>
  );
}

export function DynamicTemplateCarousel({
  templates,
  interval = 4000,
  className,
}: DynamicTemplateCarouselProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (templates.length <= 1) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % templates.length);
    }, interval);

    return () => clearInterval(id);
  }, [templates.length, interval]);

  if (templates.length === 0) {
    return (
      <div
        className={cn(
          "relative w-full h-[420px] sm:h-[480px] rounded-3xl",
          "bg-gradient-to-br from-pastel-peach to-pastel-blush",
          className,
        )}
      />
    );
  }

  if (templates.length === 1) {
    return (
      <div
        className={cn(
          "relative w-full h-[420px] sm:h-[480px] overflow-hidden rounded-3xl bg-zinc-100/50 p-6",
          "flex items-center justify-center",
          className,
        )}
      >
        <div className="w-[320px] h-[460px] transform scale-[0.55] sm:scale-[0.65] origin-center pointer-events-none rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
          <TemplateRenderer
            designSchema={templates[0].design_schema}
            fieldData={getSampleFieldData(templates[0].category)}
          />
        </div>
      </div>
    );
  }

  const card1 = templates[currentIndex % templates.length];
  const card2 = templates[(currentIndex + 1) % templates.length];

  return (
    <div
      className={cn(
        "relative w-full h-[420px] sm:h-[480px] overflow-hidden rounded-3xl bg-zinc-100/50 p-6",
        "flex items-center justify-center",
        className,
      )}
    >
      <TemplateCard template={card1} position="top-right" />
      <TemplateCard template={card2} position="bottom-left" />
    </div>
  );
}
