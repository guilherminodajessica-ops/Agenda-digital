"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Student, Teacher } from "@/types";
import { useAppData } from "@/state/app-data-context";
import { createLookups } from "@/state/selectors";
import { Button, IconButton } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-head text-sm font-bold text-navy-900">
      {initials(name)}
    </span>
  );
}

export function AdminTeachers() {
  const { school, events, updateTeacher } = useAppData();
  const lookups = useMemo(() => createLookups(school), [school]);
  const toast = useToast();
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);

  const open = (t: Teacher) => {
    setEditing(t);
    setForm({ name: t.name, email: t.email });
    setErrors({});
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (form.name.trim().length < 3) next.name = "Informe o nome completo.";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "E-mail inválido.";
    setErrors(next);
    if (Object.keys(next).length || !editing) return;
    setSaving(true);
    try {
      await updateTeacher(editing.id, { name: form.name.trim(), email: form.email.trim() });
      toast("Dados do professor atualizados (ambiente de testes).");
      setEditing(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao salvar.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Professores (fictícios)" icon="user" count={school.teachers.length} />
      <ul className="divide-y divide-line/40">
        {school.teachers.map((t) => {
          const links = school.assignments.filter((a) => a.teacherId === t.id);
          return (
            <li key={t.id} className="flex items-start gap-3 px-4 py-4 sm:px-5">
              <Avatar name={t.name} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy-900">{t.name}</p>
                <p className="truncate text-xs text-navy-800/60">{t.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {links.map((a) => (
                    <span key={a.id} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-navy-800 ring-1 ring-inset ring-line/60">
                      {lookups.subject(a.subjectId)?.name} · {lookups.schoolClass(a.classId)?.name}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-navy-800/55">
                  {events.filter((e) => e.teacherId === t.id).length} compromisso(s) cadastrados
                </p>
              </div>
              <IconButton icon="edit" label={`Editar ${t.name}`} onClick={() => open(t)} />
            </li>
          );
        })}
      </ul>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Editar professor"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Cancelar</Button>
            <Button type="submit" form="teacher-form" loading={saving}>Salvar</Button>
          </>
        }
      >
        <form id="teacher-form" onSubmit={save} noValidate className="flex flex-col gap-4">
          <Field label="Nome" htmlFor="t-name" error={errors.name}>
            <Input id="t-name" value={form.name} invalid={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="E-mail (fictício)" htmlFor="t-email" error={errors.email}>
            <Input id="t-email" type="email" value={form.email} invalid={!!errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
        </form>
      </Modal>
    </Card>
  );
}

export function AdminStudents() {
  const { school, updateStudent } = useAppData();
  const lookups = useMemo(() => createLookups(school), [school]);
  const toast = useToast();
  const [classFilter, setClassFilter] = useState("");
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: "", classId: "" });
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const list = school.students.filter((s) => !classFilter || s.classId === classFilter);

  const open = (s: Student) => {
    setEditing(s);
    setForm({ name: s.name, classId: s.classId });
    setError(undefined);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3) {
      setError("Informe o nome completo.");
      return;
    }
    if (!editing) return;
    setSaving(true);
    try {
      await updateStudent(editing.id, { name: form.name.trim(), classId: form.classId });
      toast("Dados do aluno atualizados (ambiente de testes).");
      setEditing(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao salvar.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Alunos (fictícios)"
        icon="users"
        count={list.length}
        action={
          <Select aria-label="Filtrar por turma" className="h-9 w-40 text-sm" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">Todas as turmas</option>
            {school.classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        }
      />
      {list.length === 0 ? (
        <EmptyState icon="users" title="Nenhum aluno nesta turma" />
      ) : (
        <ul className="grid divide-y divide-line/40 sm:grid-cols-2 sm:divide-y-0">
          {list.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-4 py-3 sm:border-b sm:border-line/40 sm:px-5">
              <Avatar name={s.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy-900">{s.name}</p>
                <p className="text-xs text-navy-800/60">
                  Matrícula {s.registration} · {lookups.schoolClass(s.classId)?.name}
                </p>
              </div>
              <IconButton icon="edit" label={`Editar ${s.name}`} onClick={() => open(s)} />
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Editar aluno"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Cancelar</Button>
            <Button type="submit" form="student-form" loading={saving}>Salvar</Button>
          </>
        }
      >
        <form id="student-form" onSubmit={save} noValidate className="flex flex-col gap-4">
          <Field label="Nome" htmlFor="s-name" error={error}>
            <Input id="s-name" value={form.name} invalid={!!error} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Turma" htmlFor="s-class" hint="Ao mudar de turma, a agenda do aluno passa a mostrar os compromissos da nova turma.">
            <Select id="s-class" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
              {school.classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
        </form>
      </Modal>
    </Card>
  );
}
