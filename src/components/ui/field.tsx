import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-xl border bg-white px-3.5 text-[15px] text-navy-900 transition-colors placeholder:text-navy-800/35 " +
  "focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50 disabled:text-navy-800/50";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-navy-900">
        {label}
        {optional && <span className="ml-1 font-normal text-navy-800/50">(opcional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-navy-800/55">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ invalid, className, ...props }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(CONTROL, "h-11", invalid ? "border-red-300" : "border-line", className)}
        {...props}
      />
    );
  },
);

export function Select({
  invalid,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, "h-11 appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9 select-chevron", invalid ? "border-red-300" : "border-line", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({
  invalid,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, "min-h-24 py-2.5", invalid ? "border-red-300" : "border-line", className)}
      {...props}
    />
  );
}
