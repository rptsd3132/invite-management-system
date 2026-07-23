import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardVariants = cva(
  "rounded-xl border shadow-sm overflow-hidden",
  {
    variants: {
      pastel: {
        peach: "border-pastel-peach/50 bg-pastel-peach/30",
        blush: "border-pastel-blush/50 bg-pastel-blush/30",
        sky: "border-pastel-sky/50 bg-pastel-sky/30",
        lilac: "border-pastel-lilac/50 bg-pastel-lilac/30",
        mint: "border-pastel-mint/50 bg-pastel-mint/30",
        cream: "border-pastel-cream/50 bg-pastel-cream/30",
      },
    },
  },
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, pastel, ...props }: CardProps): React.ReactElement {
  return (
    <div className={cn(cardVariants({ pastel }), "bg-yellow-100", className)} {...props} />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn("p-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}
