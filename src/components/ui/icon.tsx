import type { SVGProps } from "react";

/** Ícones de traço fino, desenhados à mão para evitar dependências. */
const PATHS = {
  calendar: "M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  chevronLeft: "M15 18l-6-6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5",
  users: "M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.15a3.5 3.5 0 0 1 0 6.7",
  user: "M19 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-7A3.5 3.5 0 0 0 5 18.5V20M12 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  shield: "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z",
  alert: "M12 8v5M12 16.5v.5M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z",
  edit: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  filter: "M4 5h16l-6 7.5V19l-4 2v-8.5L4 5z",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  home: "M4 11l8-7 8 7M6 9.5V20h12V9.5",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  info: "M12 11v6M12 7.5V8M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  school: "M3 9l9-5 9 5-9 5-9-5zM7 11.5V16c0 1.5 2.5 3 5 3s5-1.5 5-3v-4.5",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  help: "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 16.5v.5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  download: "M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14",
  play: "M8 5.5v13l11-6.5-11-6.5z",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  sparkle: "M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8L12 4z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.75,
  ...props
}: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
