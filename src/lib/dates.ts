/**
 * Utilitários de datas. Todo uso de date-fns passa por este arquivo,
 * o que mantém o formato das datas consistente em toda a aplicação.
 */
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ISODate } from "@/types";

export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/** Cabeçalho do calendário, igual às referências (semana começa no domingo). */
export const WEEKDAY_LABELS = [
  { full: "Domingo", short: "Dom", letter: "D" },
  { full: "Segunda", short: "Seg", letter: "S" },
  { full: "Terça", short: "Ter", letter: "T" },
  { full: "Quarta", short: "Qua", letter: "Q" },
  { full: "Quinta", short: "Qui", letter: "Q" },
  { full: "Sexta", short: "Sex", letter: "S" },
  { full: "Sábado", short: "Sáb", letter: "S" },
];

export function toISODate(date: Date): ISODate {
  return format(date, "yyyy-MM-dd");
}

export function fromISODate(value: ISODate): Date {
  return parseISO(value);
}

export function todayISO(): ISODate {
  return toISODate(new Date());
}

export function addDaysISO(value: ISODate, amount: number): ISODate {
  return toISODate(addDays(fromISODate(value), amount));
}

export function shiftMonth(date: Date, amount: number): Date {
  return startOfMonth(addMonths(date, amount));
}

/** Diferença em dias de calendário: positivo quando `value` está no futuro. */
export function daysFrom(today: ISODate, value: ISODate): number {
  return differenceInCalendarDays(fromISODate(value), fromISODate(today));
}

export interface MonthCell {
  iso: ISODate;
  day: number;
  inMonth: boolean;
  weekday: number;
}

/**
 * Gera as semanas do mês. Assim como nas referências, o número de linhas
 * varia (5 ou 6) e os dias fora do mês ficam vazios.
 */
export function buildMonthMatrix(month: Date): MonthCell[][] {
  const first = startOfMonth(month);
  const days = eachDayOfInterval({
    start: startOfWeek(first, { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(first), { weekStartsOn: 0 }),
  });
  const weeks: MonthCell[][] = [];
  days.forEach((d, index) => {
    if (index % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push({
      iso: toISODate(d),
      day: d.getDate(),
      inMonth: isSameMonth(d, first),
      weekday: d.getDay(),
    });
  });
  return weeks;
}

export function monthTitle(month: Date): string {
  return `${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`;
}

/** Ex.: "Sexta-feira, 13 de novembro de 2026" */
export function formatLongDate(value: ISODate): string {
  const text = format(fromISODate(value), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Ex.: "13 de novembro" */
export function formatDayMonth(value: ISODate): string {
  return format(fromISODate(value), "d 'de' MMMM", { locale: ptBR });
}

/** Ex.: "13/11/2026" */
export function formatShortDate(value: ISODate): string {
  return format(fromISODate(value), "dd/MM/yyyy");
}

/** Texto relativo amigável: "Hoje", "Amanhã", "Em 3 dias", "Há 2 dias". */
export function relativeLabel(today: ISODate, value: ISODate): string {
  const diff = daysFrom(today, value);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff === -1) return "Ontem";
  if (diff > 1) return `Em ${diff} dias`;
  return `Há ${Math.abs(diff)} dias`;
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = fromISODate(value);
  return !Number.isNaN(parsed.getTime()) && toISODate(parsed) === value;
}

export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
