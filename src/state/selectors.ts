/**
 * Funções auxiliares para consultar o estado compartilhado
 * (buscas por id, vínculos de professores etc.).
 */
import type { SchoolSnapshot } from "@/services";
import type { SchoolClass, Subject, Teacher, TeachingAssignment } from "@/types";

export function createLookups(school: SchoolSnapshot) {
  const subjectById = new Map(school.subjects.map((s) => [s.id, s]));
  const classById = new Map(school.classes.map((c) => [c.id, c]));
  const teacherById = new Map(school.teachers.map((t) => [t.id, t]));
  return {
    subject: (id: string): Subject | undefined => subjectById.get(id),
    schoolClass: (id: string): SchoolClass | undefined => classById.get(id),
    teacher: (id: string): Teacher | undefined => teacherById.get(id),
  };
}

export type Lookups = ReturnType<typeof createLookups>;

export function assignmentsOfTeacher(school: SchoolSnapshot, teacherId: string): TeachingAssignment[] {
  return school.assignments.filter((a) => a.teacherId === teacherId);
}

export function uniqueIds<T>(items: T[], pick: (item: T) => string): string[] {
  return [...new Set(items.map(pick))];
}
