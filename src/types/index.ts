/**
 * Tipos e interfaces do domínio da Agenda Digital Escolar.
 *
 * Estes tipos são independentes da forma de armazenamento. Quando um banco de
 * dados for integrado, as entidades persistidas devem seguir estes contratos.
 */

export type Role = "admin" | "teacher" | "student";

/** Datas no formato ISO local "yyyy-MM-dd" (sem fuso horário). */
export type ISODate = string;
/** Horário no formato "HH:mm". */
export type TimeString = string;

export interface Admin {
  id: string;
  name: string;
  email: string;
  position: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  registration: string;
  classId: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  shift: "Manhã" | "Tarde" | "Noite";
}

/** Cores disponíveis para identificar disciplinas (chaves do tema). */
export type SubjectColor =
  | "sky"
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "teal"
  | "orange";

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  color: SubjectColor;
}

/** Vínculo entre professor, disciplina e turma. */
export interface TeachingAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
}

export type EventCategory =
  | "prova"
  | "atividade"
  | "trabalho"
  | "projeto"
  | "planejamento"
  | "outro";

export interface AcademicEvent {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  category: EventCategory;
  date: ISODate;
  time?: TimeString;
  dueDate?: ISODate;
  createdAt: string;
  updatedAt: string;
}

/** Dados enviados pelo formulário ao criar/editar um compromisso. */
export interface AcademicEventInput {
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  category: EventCategory;
  date: ISODate;
  time?: TimeString;
  dueDate?: ISODate;
}

/**
 * Uma "ocorrência" é a forma como um compromisso aparece no calendário.
 * Um trabalho com prazo de entrega aparece em dois dias: na data do
 * compromisso e na data de entrega.
 */
export type OccurrenceKind = "evento" | "entrega";

export interface CalendarOccurrence {
  key: string;
  event: AcademicEvent;
  kind: OccurrenceKind;
  date: ISODate;
}

/** Situação de um compromisso do ponto de vista de um estudante. */
export type StudentEventStatus =
  | "concluida"
  | "atrasada"
  | "pendente"
  | "agendada"
  | "realizada";

/** Perfil escolhido na tela de acesso demonstrativo (somente em memória). */
export interface DemoSession {
  role: Role;
  userId: string;
}

export interface CalendarFilters {
  subjectIds: string[];
  categories: EventCategory[];
}
