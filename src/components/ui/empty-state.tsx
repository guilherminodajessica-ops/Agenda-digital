import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";

export function EmptyState({
  icon = "calendar",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500">
        <Icon name={icon} size={22} />
      </span>
      <p className="text-sm font-semibold text-navy-900">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-navy-800/60">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
