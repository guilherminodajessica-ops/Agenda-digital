import type { AcademicEventInput, TeachingAssignment } from "@/types";
import { isValidISODate, isValidTime } from "./dates";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export interface EventFormValues {
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  category: string;
  date: string;
  time: string;
  hasDueDate: boolean;
  dueDate: string;
}

const CATEGORY_VALUES = ["prova", "atividade", "trabalho", "projeto", "planejamento", "outro"];

/**
 * Valida o formulário de compromisso. `assignments` são os vínculos do
 * professor: só é possível publicar para disciplina/turma em que ele leciona.
 */
export function validateEventForm(
  values: EventFormValues,
  assignments: TeachingAssignment[],
): { errors: FieldErrors<EventFormValues>; input?: AcademicEventInput } {
  const errors: FieldErrors<EventFormValues> = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (title.length < 3) errors.title = "Informe um título com pelo menos 3 caracteres.";
  else if (title.length > 80) errors.title = "O título deve ter no máximo 80 caracteres.";

  if (description.length > 600) errors.description = "A descrição deve ter no máximo 600 caracteres.";

  if (!values.subjectId) errors.subjectId = "Selecione a disciplina.";
  if (!values.classId) errors.classId = "Selecione a turma.";
  else if (
    values.subjectId &&
    !assignments.some((a) => a.subjectId === values.subjectId && a.classId === values.classId)
  ) {
    errors.classId = "Você não leciona esta disciplina nesta turma.";
  }

  if (!CATEGORY_VALUES.includes(values.category)) errors.category = "Selecione a categoria.";

  if (!values.date) errors.date = "Informe a data.";
  else if (!isValidISODate(values.date)) errors.date = "Data inválida.";

  if (values.time && !isValidTime(values.time)) errors.time = "Horário inválido (use HH:mm).";

  if (values.hasDueDate) {
    if (!values.dueDate) errors.dueDate = "Informe a data de entrega.";
    else if (!isValidISODate(values.dueDate)) errors.dueDate = "Data de entrega inválida.";
    else if (values.date && isValidISODate(values.date) && values.dueDate < values.date) {
      errors.dueDate = "A entrega não pode ser antes da data do compromisso.";
    }
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors,
    input: {
      title,
      description,
      subjectId: values.subjectId,
      classId: values.classId,
      category: values.category as AcademicEventInput["category"],
      date: values.date,
      time: values.time || undefined,
      dueDate: values.hasDueDate ? values.dueDate : undefined,
    },
  };
}
