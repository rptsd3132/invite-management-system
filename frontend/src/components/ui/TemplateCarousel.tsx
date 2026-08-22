import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface TemplateCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
}

export function TemplateCarousel({
  images,
  interval = 3500,
  className,
}: TemplateCarouselProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(id);
  }, [images.length, interval]);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative w-full aspect-[4/3] rounded-2xl",
          "bg-gradient-to-br from-pastel-peach to-pastel-blush",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg",
        className,
      )}
    >
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            "transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        />
      ))}
    </div>
  );
}
