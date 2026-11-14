/**
 * Armazenamento TEMPORÁRIO em memória.
 *
 * Os dados vivem apenas enquanto a aba do navegador estiver aberta: ao
 * atualizar a página, tudo volta aos dados fictícios iniciais. Não há
 * banco de dados, localStorage ou sessionStorage.
 */
import type { AcademicEvent } from "@/types";
import type { SchoolSnapshot } from "../contracts";
import * as mock from "@/data/mock-data";
import { todayISO } from "@/lib/dates";

interface MemoryState {
  school: SchoolSnapshot;
  events: AcademicEvent[];
  completions: Map<string, Set<string>>;
}

let state: MemoryState | null = null;

export function getStore(): MemoryState {
  if (!state) {
    state = {
      school: structuredClone({
        admins: mock.admins,
        teachers: mock.teachers,
        students: mock.students,
        classes: mock.classes,
        subjects: mock.subjects,
        assignments: mock.assignments,
      }),
      events: mock.createSeedEvents(todayISO()),
      completions: new Map(
        Object.entries(mock.seedCompletions).map(([studentId, ids]) => [studentId, new Set(ids)]),
      ),
    };
  }
  return state;
}

/** Simula a latência de uma requisição, para exibir estados de carregamento. */
export function simulateLatency(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let counter = 0;
export function newId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export const clone = <T,>(value: T): T => structuredClone(value);
