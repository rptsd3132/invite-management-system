import { cn } from "../lib/utils";
import { Card } from "./ui/Card";

const PASTEL_VARIANTS = ["peach", "blush", "sky", "lilac", "mint", "cream"] as const;
type PastelVariant = (typeof PASTEL_VARIANTS)[number];
          
interface TemplateCardProps {
  category: string;
  thumbnailUrl: string | null;
  onClick: () => void;
  index?: number;
  className?: string;
}

export function TemplateCard({ category, thumbnailUrl, onClick, index = 0, className }: TemplateCardProps): React.ReactElement {
  const pastelVariant = PASTEL_VARIANTS[index % PASTEL_VARIANTS.length] as PastelVariant;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "snap-start shrink-0 w-64 md:w-72 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-xl",
        className,
      )}
    >
      <Card
        pastel={pastelVariant}
        className="hover:-translate-y-1 hover:scale-[1.02] transition-transform"
      >
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-white/80 to-white/40 p-4 m-3 rounded-lg shadow-sm">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={category}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-neutral-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-xs">{category}</span>
            </div>
          )}
        </div>
        <div className="pb-4 text-center">
          <span className={cn(
            "inline-block rounded-full px-3 py-1 text-sm font-medium",
            "bg-neutral-900/5 text-neutral-700 group-hover:bg-brand/10 group-hover:text-brand transition-colors",
          )}>
            {category}
          </span>
        </div>
      </Card>
    </button>
  );
}
