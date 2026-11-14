"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { AcademicEvent, AcademicEventInput, ISODate, TeachingAssignment } from "@/types";
import { CATEGORIES, categoryMeta } from "@/lib/categories";
import { validateEventForm, type EventFormValues, type FieldErrors } from "@/lib/validation";
import type { Lookups } from "@/state/selectors";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";

function initialValues(event: AcademicEvent | null, defaultDate: ISODate, assignments: TeachingAssignment[], defaultClassId?: string): EventFormValues {
  if (event) {
    return {
      title: event.title,
      description: event.description,
      subjectId: event.subjectId,
      classId: event.classId,
      category: event.category,
      date: event.date,
      time: event.time ?? "",
      hasDueDate: !!event.dueDate,
      dueDate: event.dueDate ?? "",
    };
  }
  const first = assignments.find((a) => a.classId === defaultClassId) ?? assignments[0];
  return {
    title: "",
    description: "",
    subjectId: first?.subjectId ?? "",
    classId: first?.classId ?? "",
    category: "atividade",
    date: defaultDate,
    time: "",
    hasDueDate: false,
    dueDate: "",
  };
}

/**
 * Formulário de cadastro/edição de compromisso. A disciplina e a turma
 * são limitadas aos vínculos do professor.
 */
export function EventFormModal({
  open,
  event,
  defaultDate,
  defaultClassId,
  assignments,
  lookups,
  onClose,
  onSubmit,
}: {
  open: boolean;
  event: AcademicEvent | null;
  defaultDate: ISODate;
  defaultClassId?: string;
  assignments: TeachingAssignment[];
  lookups: Lookups;
  onClose: () => void;
  onSubmit: (input: AcademicEventInput) => Promise<void>;
}) {
  const [values, setValues] = useState<EventFormValues>(() => initialValues(event, defaultDate, assignments, defaultClassId));
  const [errors, setErrors] = useState<FieldErrors<EventFormValues>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(initialValues(event, defaultDate, assignments, defaultClassId));
      setErrors({});
      setSubmitError(null);
    }
    // Reinicia o formulário apenas ao abrir (dependências intencionalmente reduzidas).
  }, [open, event]);

  const subjectIds = useMemo(() => [...new Set(assignments.map((a) => a.subjectId))], [assignments]);
  const classOptions = useMemo(
    () => assignments.filter((a) => a.subjectId === values.subjectId).map((a) => a.classId),
    [assignments, values.subjectId],
  );

  const set = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const changeSubject = (subjectId: string) => {
    const classes = assignments.filter((a) => a.subjectId === subjectId).map((a) => a.classId);
    setValues((v) => ({ ...v, subjectId, classId: classes.includes(v.classId) ? v.classId : classes[0] ?? "" }));
    setErrors((e) => ({ ...e, subjectId: undefined, classId: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = validateEventForm(values, assignments);
    if (!result.input) {
      setErrors(result.errors);
      setSubmitError("Revise os campos destacados.");
      return;
    }
    setSaving(true);
    setSubmitError(null);
    try {
      await onSubmit(result.input);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  const isPrivate = categoryMeta(values.category as AcademicEvent["category"]).private;

  return (
    <Modal
      open={open}
      onClose={saving ? () => undefined : onClose}
      title={event ? "Editar compromisso" : "Novo compromisso"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="event-form" loading={saving} icon="check">
            {event ? "Salvar alterações" : "Publicar compromisso"}
          </Button>
        </>
      }
    >
      <form id="event-form" onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2" data-explain="Formulário de compromisso. Os campos são validados antes de salvar; a turma escolhida define quais alunos verão o compromisso.">
        {submitError && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700 sm:col-span-2">
            <Icon name="alert" size={16} /> {submitError}
          </div>
        )}

        <Field label="Título" htmlFor="ev-title" error={errors.title} className="sm:col-span-2">
          <Input
            id="ev-title"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ex.: Prova de frações"
            invalid={!!errors.title}
            maxLength={80}
          />
        </Field>

        <Field label="Disciplina" htmlFor="ev-subject" error={errors.subjectId}>
          <Select id="ev-subject" value={values.subjectId} onChange={(e) => changeSubject(e.target.value)} invalid={!!errors.subjectId}>
            <option value="">Selecione…</option>
            {subjectIds.map((id) => (
              <option key={id} value={id}>
                {lookups.subject(id)?.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Turma" htmlFor="ev-class" error={errors.classId} hint="Os alunos desta turma verão o compromisso.">
          <Select id="ev-class" value={values.classId} onChange={(e) => set("classId", e.target.value)} invalid={!!errors.classId}>
            <option value="">Selecione…</option>
            {classOptions.map((id) => (
              <option key={id} value={id}>
                {lookups.schoolClass(id)?.name}
              </option>
            ))}
          </Select>
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 text-sm font-semibold text-navy-900">Categoria</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((c) => {
              const checked = values.category === c.value;
              return (
                <label
                  key={c.value}
                  className={`flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors ${
                    checked ? "border-navy-900 bg-head text-navy-900" : "border-line text-navy-800 hover:bg-sky-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={c.value}
                    checked={checked}
                    onChange={() => set("category", c.value)}
                    className="sr-only"
                  />
                  <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                  {c.label}
                  {c.private && <Icon name="lock" size={13} className="ml-auto text-navy-800/50" />}
                </label>
              );
            })}
          </div>
          {isPrivate && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-navy-800/65">
              <Icon name="lock" size={13} /> Planejamentos são privados: aparecem só para você e para a administração.
            </p>
          )}
          {errors.category && <p className="mt-1 text-xs font-medium text-red-600">{errors.category}</p>}
        </fieldset>

        <Field label="Data" htmlFor="ev-date" error={errors.date}>
          <Input id="ev-date" type="date" value={values.date} onChange={(e) => set("date", e.target.value)} invalid={!!errors.date} />
        </Field>

        <Field label="Horário" htmlFor="ev-time" error={errors.time} optional>
          <Input id="ev-time" type="time" value={values.time} onChange={(e) => set("time", e.target.value)} invalid={!!errors.time} />
        </Field>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm font-semibold text-navy-900">
            <input
              type="checkbox"
              checked={values.hasDueDate}
              onChange={(e) => {
                const checked = e.target.checked;
                setValues((v) => ({ ...v, hasDueDate: checked, dueDate: checked && !v.dueDate ? v.date : v.dueDate }));
                setErrors((er) => ({ ...er, dueDate: undefined }));
              }}
              className="h-5 w-5 rounded border-line accent-navy-900"
            />
            Possui data de entrega
          </label>
          {values.hasDueDate && (
            <Field label="Data de entrega" htmlFor="ev-due" error={errors.dueDate} className="sm:max-w-[calc(50%-0.5rem)]">
              <Input id="ev-due" type="date" value={values.dueDate} min={values.date || undefined} onChange={(e) => set("dueDate", e.target.value)} invalid={!!errors.dueDate} />
            </Field>
          )}
        </div>

        <Field label="Descrição" htmlFor="ev-desc" error={errors.description} optional className="sm:col-span-2">
          <Textarea
            id="ev-desc"
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Orientações, conteúdo, materiais necessários…"
            invalid={!!errors.description}
            maxLength={600}
          />
        </Field>
      </form>
    </Modal>
  );
}
