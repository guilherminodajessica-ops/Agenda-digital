"use client";

import { MONTH_NAMES, monthTitle } from "@/lib/dates";
import { Button, IconButton } from "@/components/ui/button";

export function CalendarToolbar({
  month,
  onChange,
  onToday,
}: {
  month: Date;
  onChange: (month: Date) => void;
  onToday: () => void;
}) {
  const year = month.getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => year - 3 + i);
  const go = (y: number, m: number) => onChange(new Date(y, m, 1));

  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-5 lg:flex-row lg:items-end lg:justify-between">
      <h2
        className="text-[28px] font-extrabold uppercase leading-none tracking-tight text-navy-900 sm:text-4xl lg:text-[44px]"
        aria-live="polite"
        data-testid="calendar-title"
        data-explain="Mês e ano exibidos na grade, no mesmo estilo das imagens de referência."
      >
        {monthTitle(month)}
      </h2>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" data-explain="Navegação do calendário: setas para o mês anterior e o próximo, botão Hoje e seleção direta de mês e ano.">
        <div className="flex items-center rounded-full border border-line bg-white p-0.5">
          <IconButton icon="chevronLeft" label="Mês anterior" onClick={() => go(year, month.getMonth() - 1)} />
          <Button variant="ghost" size="sm" className="rounded-full px-2 sm:px-3" onClick={onToday}>
            Hoje
          </Button>
          <IconButton icon="chevronRight" label="Próximo mês" onClick={() => go(year, month.getMonth() + 1)} />
        </div>
        <label className="sr-only" htmlFor="cal-month">Mês</label>
        <select
          id="cal-month"
          value={month.getMonth()}
          onChange={(e) => go(year, Number(e.target.value))}
          className="select-chevron h-10 appearance-none rounded-full border border-line bg-white bg-[length:14px] bg-[right_10px_center] bg-no-repeat pl-3 pr-8 text-sm sm:pl-4 sm:pr-9 font-semibold text-navy-900 focus:outline-none focus:ring-4 focus:ring-sky-100"
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="cal-year">Ano</label>
        <select
          id="cal-year"
          value={year}
          onChange={(e) => go(Number(e.target.value), month.getMonth())}
          className="select-chevron h-10 appearance-none rounded-full border border-line bg-white bg-[length:14px] bg-[right_10px_center] bg-no-repeat pl-3 pr-8 text-sm sm:pl-4 sm:pr-9 font-semibold text-navy-900 focus:outline-none focus:ring-4 focus:ring-sky-100"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
