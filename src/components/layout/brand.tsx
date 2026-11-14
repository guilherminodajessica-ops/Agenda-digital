import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Símbolo: folha de calendário com as argolas e um dia marcado. */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect x="4" y="7" width="40" height="37" rx="10" fill="var(--color-navy-900)" />
      <rect x="4" y="7" width="40" height="13" rx="10" fill="var(--color-sky-500)" />
      <rect x="4" y="14" width="40" height="6" fill="var(--color-sky-500)" />
      <rect x="13" y="3" width="5" height="10" rx="2.5" fill="var(--color-white)" stroke="var(--color-navy-900)" strokeWidth="1.5" />
      <rect x="30" y="3" width="5" height="10" rx="2.5" fill="var(--color-white)" stroke="var(--color-navy-900)" strokeWidth="1.5" />
      <circle cx="14" cy="28" r="2.6" fill="var(--color-white)" opacity="0.55" />
      <circle cx="24" cy="28" r="2.6" fill="var(--color-white)" opacity="0.55" />
      <circle cx="34" cy="28" r="2.6" fill="var(--color-white)" opacity="0.55" />
      <circle cx="14" cy="37" r="2.6" fill="var(--color-white)" opacity="0.55" />
      <circle cx="24" cy="37" r="5" fill="var(--color-accent)" />
      <path d="M21.6 37l1.7 1.7 3.2-3.4" fill="none" stroke="var(--color-navy-950)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34" cy="37" r="2.6" fill="var(--color-white)" opacity="0.55" />
    </svg>
  );
}

export function Logo({ compact, onDark }: { compact?: boolean; onDark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" data-explain="Logotipo da Agenda Digital Escolar: uma folha de calendário com um dia marcado como concluído.">
      <LogoMark size={compact ? 36 : 44} />
      <span className="whitespace-nowrap leading-none">
        <span className={cn("block font-extrabold tracking-tight", compact ? "text-[17px]" : "text-[22px]", onDark ? "text-white" : "text-navy-900")}>
          agenda<span className={onDark ? "text-sky-300" : "text-sky-500"}>digital</span>
        </span>
        <span className={cn("mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em]", onDark ? "text-white/70" : "text-navy-800/70")}>
          <span className="h-0.5 w-3 rounded-full bg-accent" />
          escolar
        </span>
      </span>
    </div>
  );
}

/** Identificação discreta de ambiente de testes. */
export function DemoBadge({ className, short }: { className?: string; short?: boolean }) {
  return (
    <span
      title="Ambiente de testes: dados fictícios e temporários, sem login real."
      data-explain="Aviso de que este é um ambiente de testes: os dados são fictícios e somem quando a página é atualizada."
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-navy-900 ring-1 ring-inset ring-accent/50",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {short ? "Testes" : "Ambiente de testes"}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-sm font-medium text-sky-700">{eyebrow}</p>}
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-navy-800/65">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
