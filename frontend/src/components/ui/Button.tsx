import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#706FD3]/10 focus-visible:border-[#706FD3] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#706FD3] to-indigo-600 text-white shadow-sm shadow-[#706FD3]/25 hover:shadow-lg hover:shadow-[#706FD3]/20 hover:-translate-y-[1px] hover:brightness-110",
        outline:
          "border border-stone-200 bg-white/80 backdrop-blur-sm text-zinc-700 shadow-sm hover:bg-stone-50 hover:text-zinc-900",
        ghost: "text-zinc-600 hover:bg-stone-100/80 hover:text-zinc-900",
        secondary:
          "bg-stone-100 text-zinc-700 hover:bg-stone-200/80 hover:text-zinc-900",
        danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 hover:-translate-y-[1px]",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-10 px-4.5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps): React.ReactElement {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
