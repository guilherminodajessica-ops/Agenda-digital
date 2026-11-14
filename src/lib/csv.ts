import type { AcademicEvent } from "@/types";
import type { Lookups } from "@/state/selectors";
import { categoryMeta } from "./categories";

function cell(value: string): string {
  return /[",;\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Gera o conteúdo CSV dos compromissos (bloco 3C), separado por vírgula. */
export function eventsToCsv(events: AcademicEvent[], lookups: Lookups): string {
  const header = ["titulo", "categoria", "disciplina", "turma", "professor", "data", "horario", "entrega"];
  const rows = events.map((e) => [
    e.title,
    categoryMeta(e.category).label,
    lookups.subject(e.subjectId)?.name ?? "",
    lookups.schoolClass(e.classId)?.name ?? "",
    lookups.teacher(e.teacherId)?.name ?? "",
    e.date,
    e.time ?? "",
    e.dueDate ?? "",
  ]);
  return [header, ...rows].map((r) => r.map(cell).join(",")).join("\n");
}

/** Contagem por categoria, pronta para um gráfico de barras. */
export function categoryCountsCsv(events: AcademicEvent[]): string {
  const counts = new Map<string, number>();
  for (const e of events) {
    const label = categoryMeta(e.category).label;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return ["categoria,quantidade", ...[...counts].map(([k, v]) => `${k},${v}`)].join("\n");
}

/** Faz o navegador baixar um arquivo de texto (nada é guardado no navegador). */
export function downloadText(filename: string, content: string): void {
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
