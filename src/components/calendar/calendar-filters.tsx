"use client";
import type { ReactNode } from "react";

import type { CalendarFilters, EventCategory, Subject } from "@/types";
import type { CategoryMeta } from "@/lib/categories";
import { SUBJECT_COLORS } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Chip({
  active,
  onClick,
  children,
  dotClass,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  dotClass?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold transition-colors",
        active
          ? "border-navy-900 bg-navy-900 text-white"
          : "border-line bg-white text-navy-800 hover:border-sky-300 hover:bg-sky-50",
      )}
    >
      {dotClass && <span className={cn("h-2 w-2 rounded-full", active ? "bg-white" : dotClass)} />}
      {children}
    </button>
  );
}

export function CalendarFiltersBar({
  filters,
  onChange,
  subjects,
  categories,
}: {
  filters: CalendarFilters;
  onChange: (f: CalendarFilters) => void;
  subjects: Subject[];
  categories: CategoryMeta[];
}) {
  const active = filters.subjectIds.length + filters.categories.length;
  return (
    <div className="mb-4 flex flex-col gap-2.5" data-testid="calendar-filters" data-explain="Filtros: a primeira linha filtra por disciplina e a segunda por categoria. Sem nenhum filtro marcado, tudo aparece. A regra usa os operadores lógicos E e OU.">
      <div className="flex items-center gap-2">
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy-800/60">
          <Icon name="filter" size={14} /> Filtros
        </span>
        {active > 0 && (
          <button
            type="button"
            onClick={() => onChange({ subjectIds: [], categories: [] })}
            className="ml-auto text-xs font-semibold text-sky-700 hover:underline"
          >
            Limpar filtros ({active})
          </button>
        )}
      </div>
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por disciplina">
        {subjects.map((s) => (
          <Chip
            key={s.id}
            active={filters.subjectIds.includes(s.id)}
            onClick={() => onChange({ ...filters, subjectIds: toggle(filters.subjectIds, s.id) })}
            dotClass={SUBJECT_COLORS[s.color].dot}
          >
            {s.name}
          </Chip>
        ))}
      </div>
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por categoria">
        {categories.map((c) => (
          <Chip
            key={c.value}
            active={filters.categories.includes(c.value)}
            onClick={() =>
              onChange({ ...filters, categories: toggle<EventCategory>(filters.categories, c.value) })
            }
            dotClass={c.dot}
          >
            {c.plural}
          </Chip>
        ))}
      </div>
    </div>
  );
}
