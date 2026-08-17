import { cn } from "../../lib/utils";

interface FieldShellProps {
  id?: string;
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

function FieldShell({
  id,
  label,
  error,
  hint,
  className,
  children,
}: FieldShellProps): React.ReactElement {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium uppercase tracking-wider text-zinc-400"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}

function controlClasses(hasError: boolean, hasIcon: boolean): string {
  return cn(
    "block w-full rounded-xl border bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm shadow-zinc-900/5 outline-none transition-all duration-200 ease-out focus:bg-white",
    hasIcon && "pl-10",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      : "border-zinc-200 hover:border-zinc-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10",
  );
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  leadingIcon,
  wrapperClassName,
  id,
  className,
  ...props
}: InputProps): React.ReactElement {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={wrapperClassName}>
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-400">
            {leadingIcon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(controlClasses(Boolean(error), Boolean(leadingIcon)), className)}
          {...props}
        />
      </div>
    </FieldShell>
  );
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export function Textarea({
  label,
  error,
  hint,
  wrapperClassName,
  id,
  className,
  ...props
}: TextareaProps): React.ReactElement {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={wrapperClassName}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(controlClasses(Boolean(error), false), "resize-none", className)}
        {...props}
      />
    </FieldShell>
  );
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export function Select({
  label,
  error,
  hint,
  leadingIcon,
  wrapperClassName,
  id,
  className,
  children,
  ...props
}: SelectProps): React.ReactElement {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={wrapperClassName}>
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-400">
            {leadingIcon}
          </span>
        )}
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(
            controlClasses(Boolean(error), Boolean(leadingIcon)),
            "cursor-pointer appearance-none pr-10",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-zinc-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </FieldShell>
  );
}
