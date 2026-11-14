import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { Spinner } from "./spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800 shadow-sm shadow-navy-900/10",
  secondary: "bg-white text-navy-900 ring-1 ring-inset ring-line hover:bg-sky-50",
  ghost: "text-navy-800 hover:bg-sky-50",
  soft: "bg-sky-100/70 text-navy-900 hover:bg-sky-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", icon, loading, className, children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center rounded-xl font-semibold transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size={16} /> : icon ? <Icon name={icon} size={17} /> : null}
      {children}
    </button>
  );
});

export function IconButton({
  icon,
  label,
  className,
  ...props
}: { icon: IconName; label: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-navy-900 transition-colors",
        "hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={20} />
    </button>
  );
}
