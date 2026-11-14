import type { EventCategory, SubjectColor } from "@/types";

export interface CategoryMeta {
  value: EventCategory;
  label: string;
  plural: string;
  /** Pode ser marcado como concluído e ficar atrasado. */
  deliverable: boolean;
  /** Visível apenas para o professor (e administração). */
  private: boolean;
  /** Classes Tailwind escritas por extenso para que o compilador as encontre. */
  chip: string;
  dot: string;
  badge: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    value: "prova",
    label: "Prova",
    plural: "Provas",
    deliverable: false,
    private: false,
    chip: "bg-rose-50 text-rose-800 border-rose-200",
    dot: "bg-rose-400",
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  {
    value: "atividade",
    label: "Atividade",
    plural: "Atividades",
    deliverable: true,
    private: false,
    chip: "bg-sky-50 text-sky-800 border-sky-200",
    dot: "bg-sky-400",
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  {
    value: "trabalho",
    label: "Trabalho",
    plural: "Trabalhos",
    deliverable: true,
    private: false,
    chip: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  {
    value: "projeto",
    label: "Projeto",
    plural: "Projetos",
    deliverable: true,
    private: false,
    chip: "bg-violet-50 text-violet-800 border-violet-200",
    dot: "bg-violet-400",
    badge: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  {
    value: "planejamento",
    label: "Planejamento",
    plural: "Planejamentos",
    deliverable: false,
    private: true,
    chip: "bg-slate-100 text-slate-700 border-slate-300 border-dashed",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-700 ring-slate-300",
  },
  {
    value: "outro",
    label: "Outro",
    plural: "Outros",
    deliverable: true,
    private: false,
    chip: "bg-teal-50 text-teal-800 border-teal-200",
    dot: "bg-teal-400",
    badge: "bg-teal-50 text-teal-700 ring-teal-200",
  },
];

const BY_VALUE = new Map(CATEGORIES.map((c) => [c.value, c]));

export function categoryMeta(value: EventCategory): CategoryMeta {
  return BY_VALUE.get(value) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const STUDENT_CATEGORIES = CATEGORIES.filter((c) => !c.private);

export const SUBJECT_COLORS: Record<SubjectColor, { text: string; soft: string; dot: string }> = {
  sky: { text: "text-sky-700", soft: "bg-sky-50 ring-sky-200", dot: "bg-sky-500" },
  indigo: { text: "text-indigo-700", soft: "bg-indigo-50 ring-indigo-200", dot: "bg-indigo-500" },
  emerald: { text: "text-emerald-700", soft: "bg-emerald-50 ring-emerald-200", dot: "bg-emerald-500" },
  amber: { text: "text-amber-700", soft: "bg-amber-50 ring-amber-200", dot: "bg-amber-500" },
  rose: { text: "text-rose-700", soft: "bg-rose-50 ring-rose-200", dot: "bg-rose-500" },
  violet: { text: "text-violet-700", soft: "bg-violet-50 ring-violet-200", dot: "bg-violet-500" },
  teal: { text: "text-teal-700", soft: "bg-teal-50 ring-teal-200", dot: "bg-teal-500" },
  orange: { text: "text-orange-700", soft: "bg-orange-50 ring-orange-200", dot: "bg-orange-500" },
};
