import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  labels: string[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  labels,
  onStepClick,
}: StepIndicatorProps): React.ReactElement {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {labels.map((label, i) => {
        const step = i + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;

        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onStepClick?.(step)}
              disabled={!onStepClick}
              className="group flex items-center gap-2.5"
            >
              <span
                className={cn(
                  "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ease-out",
                  isActive &&
                    "bg-gradient-to-br from-violet-600 to-indigo-600 text-white ring-4 ring-violet-500/10 animate-glow-pulse",
                  isDone && "bg-gradient-to-br from-violet-600 to-indigo-600 text-white",
                  !isActive && !isDone && "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200/70 group-hover:text-zinc-600",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : step}
              </span>
              <span
                className={cn(
                  "hidden whitespace-nowrap text-sm font-medium transition-colors duration-200 sm:block",
                  isActive ? "text-zinc-900" : isDone ? "text-zinc-600" : "text-zinc-400",
                )}
              >
                {label}
              </span>
            </button>

            {i < labels.length - 1 && (
              <span
                aria-hidden
                className="relative h-px w-8 overflow-hidden rounded-full bg-zinc-200 sm:w-12"
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-[width] duration-500 ease-out",
                    step <= currentStep - 1 ? "w-full" : "w-0",
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}