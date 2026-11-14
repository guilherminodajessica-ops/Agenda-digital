/**
 * Contratos (interfaces) da camada de dados.
 *
 * A interface do usuário conversa apenas com estes contratos. Hoje eles são
 * implementados em memória (`in-memory/`). Para integrar um banco de dados,
 * basta criar novas implementações (ex.: chamando uma API) e trocá-las em
 * `services/index.ts` — os componentes não precisam mudar.
 */
import type {
  AcademicEvent,
  AcademicEventInput,
  Admin,
  SchoolClass,
  Student,
  Subject,
  Teacher,
  TeachingAssignment,
} from "@/types";

export interface SchoolSnapshot {
  admins: Admin[];
  teachers: Teacher[];
  students: Student[];
  classes: SchoolClass[];
  subjects: Subject[];
  assignments: TeachingAssignment[];
}

export interface EventRepository {
  list(): Promise<AcademicEvent[]>;
  create(teacherId: string, input: AcademicEventInput): Promise<AcademicEvent>;
  update(id: string, input: AcademicEventInput): Promise<AcademicEvent>;
  remove(id: string): Promise<void>;
}

export interface SchoolRepository {
  snapshot(): Promise<SchoolSnapshot>;
  updateTeacher(id: string, patch: Pick<Teacher, "name" | "email">): Promise<Teacher>;
  updateStudent(id: string, patch: Pick<Student, "name" | "classId">): Promise<Student>;
  addAssignment(data: Omit<TeachingAssignment, "id">): Promise<TeachingAssignment>;
  removeAssignment(id: string): Promise<void>;
}

/** Conclusões individuais: nunca alteram o compromisso original. */
export interface CompletionRepository {
  listAll(): Promise<Record<string, string[]>>;
  setCompleted(studentId: string, eventId: string, completed: boolean): Promise<void>;
}

export class RepositoryError extends Error {}
