"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { TeachingAssignment } from "@/types";
import { SUBJECT_COLORS } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { useAppData } from "@/state/app-data-context";
import { createLookups } from "@/state/selectors";
import { Button, IconButton } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Select } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export function AdminClasses() {
  const { school, events } = useAppData();
  const lookups = useMemo(() => createLookups(school), [school]);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {school.classes.map((c) => {
        const students = school.students.filter((s) => s.classId === c.id);
        const links = school.assignments.filter((a) => a.classId === c.id);
        return (
          <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold text-navy-900">{c.name}</p>
                <p className="text-xs text-navy-800/60">{c.grade} · {c.shift}</p>
              </div>
              <span className="rounded-full bg-head px-2.5 py-1 text-xs font-semibold text-navy-900">
                {students.length} aluno(s)
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-navy-800/50">Disciplinas e professores</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {links.map((a) => (
                <li key={a.id} className="flex justify-between gap-2 text-sm">
                  <span className="font-semibold text-navy-900">{lookups.subject(a.subjectId)?.name}</span>
                  <span className="truncate text-navy-800/65">{lookups.teacher(a.teacherId)?.name}</span>
                </li>
              ))}
              {links.length === 0 && <li className="text-sm text-navy-800/50">Sem vínculos.</li>}
            </ul>
            <p className="mt-4 border-t border-line/40 pt-3 text-xs text-navy-800/60">
              {events.filter((e) => e.classId === c.id).length} compromisso(s) cadastrados
            </p>
          </Card>
        );
      })}
    </div>
  );
}

export function AdminSubjects() {
  const { school } = useAppData();
  const lookups = useMemo(() => createLookups(school), [school]);
  return (
    <Card>
      <CardHeader title="Disciplinas" icon="book" count={school.subjects.length} />
      <ul className="divide-y divide-line/40">
        {school.subjects.map((s) => {
          const links = school.assignments.filter((a) => a.subjectId === s.id);
          const color = SUBJECT_COLORS[s.color];
          return (
            <li key={s.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 sm:w-64">
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold ring-1 ring-inset", color.soft, color.text)}>
                  {s.shortName}
                </span>
                <span className="font-semibold text-navy-900">{s.name}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {links.map((a) => (
                  <span key={a.id} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-navy-800 ring-1 ring-inset ring-line/60">
                    {lookups.schoolClass(a.classId)?.name} · {lookups.teacher(a.teacherId)?.name}
                  </span>
                ))}
                {links.length === 0 && <span className="text-sm text-navy-800/50">Sem vínculos.</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function AdminAssignments() {
  const { school, addAssignment, removeAssignment } = useAppData();
  const lookups = useMemo(() => createLookups(school), [school]);
  const toast = useToast();
  const [form, setForm] = useState({ teacherId: "", subjectId: "", classId: "" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toRemove, setToRemove] = useState<TeachingAssignment | null>(null);
  const [removing, setRemoving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.teacherId || !form.subjectId || !form.classId) {
      setError("Selecione professor, disciplina e turma.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await addAssignment(form);
      toast("Vínculo criado (ambiente de testes).");
      setForm({ teacherId: "", subjectId: "", classId: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o vínculo.");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = async () => {
    if (!toRemove) return;
    setRemoving(true);
    try {
      await removeAssignment(toRemove.id);
      toast("Vínculo removido.");
      setToRemove(null);
    } finally {
      setRemoving(false);
    }
  };

  const sorted = [...school.assignments].sort(
    (a, b) =>
      (lookups.schoolClass(a.classId)?.name ?? "").localeCompare(lookups.schoolClass(b.classId)?.name ?? "") ||
      (lookups.subject(a.subjectId)?.name ?? "").localeCompare(lookups.subject(b.subjectId)?.name ?? ""),
  );

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="Professor · Disciplina · Turma" icon="link" count={school.assignments.length} />
        {sorted.length === 0 ? (
          <EmptyState icon="link" title="Nenhum vínculo cadastrado" />
        ) : (
          <ul className="divide-y divide-line/40">
            {sorted.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="grid min-w-0 flex-1 gap-0.5 sm:grid-cols-3 sm:gap-3">
                  <span className="truncate text-sm font-semibold text-navy-900">{lookups.teacher(a.teacherId)?.name}</span>
                  <span className="truncate text-sm text-navy-800/80">{lookups.subject(a.subjectId)?.name}</span>
                  <span className="truncate text-sm text-navy-800/80">{lookups.schoolClass(a.classId)?.name}</span>
                </div>
                <IconButton icon="trash" label="Remover vínculo" className="text-red-600 hover:bg-red-50" onClick={() => setToRemove(a)} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="h-fit">
        <CardHeader title="Novo vínculo" icon="plus" />
        <form onSubmit={submit} noValidate className="flex flex-col gap-4 p-5">
          <Field label="Professor" htmlFor="a-teacher">
            <Select id="a-teacher" value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
              <option value="">Selecione…</option>
              {school.teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <Field label="Disciplina" htmlFor="a-subject">
            <Select id="a-subject" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
              <option value="">Selecione…</option>
              {school.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
          <Field label="Turma" htmlFor="a-class">
            <Select id="a-class" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
              <option value="">Selecione…</option>
              {school.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
          <Button type="submit" icon="plus" loading={saving}>Adicionar vínculo</Button>
        </form>
      </Card>

      <ConfirmDialog
        open={!!toRemove}
        title="Remover vínculo?"
        message={
          toRemove && (
            <>
              {lookups.teacher(toRemove.teacherId)?.name} deixará de lecionar {lookups.subject(toRemove.subjectId)?.name} no{" "}
              {lookups.schoolClass(toRemove.classId)?.name}. Os compromissos já cadastrados continuam visíveis.
            </>
          )
        }
        confirmLabel="Remover"
        danger
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => setToRemove(null)}
      />
    </div>
  );
}
