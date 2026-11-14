"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Role } from "@/types";
import { SUBJECT_COLORS } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { buildMonthMatrix, fromISODate, monthTitle, WEEKDAY_LABELS } from "@/lib/dates";
import { useAppData } from "@/state/app-data-context";
import { useSession } from "@/state/session-context";
import { DemoBadge, Logo } from "@/components/layout/brand";
import { Icon, type IconName } from "@/components/ui/icon";
import { LoadingState } from "@/components/ui/spinner";

const ROLES: { role: Role; title: string; description: string; icon: IconName; href: string; explain: string }[] = [
  {
    role: "student",
    title: "Sou aluno",
    description: "Ver as datas da minha turma.",
    icon: "school",
    href: "/aluno",
    explain: "Abre a lista de alunos fictícios. Ao escolher um, o site mostra a agenda da turma dele.",
  },
  {
    role: "teacher",
    title: "Sou professor",
    description: "Lançar compromissos para as minhas turmas.",
    icon: "book",
    href: "/professor",
    explain: "Abre a lista de matérias. Cada matéria tem um professor fictício, que lança compromissos para as turmas.",
  },
  {
    role: "admin",
    title: "Sou da administração",
    description: "Consultar turmas, matérias, professores e alunos.",
    icon: "shield",
    href: "/admin",
    explain: "Entra direto no painel da administração, que mostra todos os dados da escola fictícia.",
  },
];

export default function AccessPage() {
  const router = useRouter();
  const { enterAs } = useSession();
  const { status, school, today } = useAppData();
  const [selected, setSelected] = useState<Role | null>(null);
  const className = (id: string) => school.classes.find((c) => c.id === id)?.name ?? "";

  const enter = (role: Role, userId: string) => {
    enterAs(role, userId);
    router.push(ROLES.find((r) => r.role === role)!.href);
  };

  const choose = (role: Role) => {
    if (role === "admin") {
      const admin = school.admins[0];
      if (admin) enter("admin", admin.id);
      return;
    }
    setSelected((current) => (current === role ? null : role));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-sky-100/70" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 h-[420px] w-[420px] rounded-full bg-accent-soft/70" aria-hidden="true" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/sobre"
            data-explain="Página que descreve o trabalho: objetivo, problema, processo, resultado, conteúdos da disciplina e declaração de uso de IA."
            className="hidden text-sm font-semibold text-navy-800 underline-offset-4 hover:underline sm:inline"
          >
            Sobre o projeto
          </Link>
          <DemoBadge />
        </div>
      </header>

      <main className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-24 pt-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-10">
        <section className="animate-rise">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-sky-600">
            <span className="h-0.5 w-6 rounded-full bg-accent" /> Agenda da turma
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-900 sm:text-5xl">
            Provas, trabalhos e atividades da turma em um único calendário.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-800/75">
            O professor lança a data. Os alunos da turma veem o compromisso no calendário no mesmo instante.
          </p>

          <p className="mb-3 mt-8 text-sm font-semibold text-navy-900">Como você quer entrar?</p>
          <div className="flex flex-col gap-3" data-testid="role-picker">
            {status !== "ready" ? (
              <LoadingState label="Carregando dados fictícios…" />
            ) : (
              ROLES.map((r) => {
                const open = selected === r.role;
                return (
                  <div
                    key={r.role}
                    className={cn(
                      "overflow-hidden rounded-2xl border bg-white transition-shadow",
                      open ? "border-sky-400 shadow-lg shadow-sky-100" : "border-line/70 hover:shadow-md hover:shadow-sky-100/60",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => choose(r.role)}
                      aria-expanded={r.role === "admin" ? undefined : open}
                      data-explain={r.explain}
                      className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                    >
                      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors", open ? "bg-navy-900 text-white" : "bg-head text-navy-900")}>
                        <Icon name={r.icon} size={22} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[17px] font-bold text-navy-900">{r.title}</span>
                        <span className="block text-sm text-navy-800/65">{r.description}</span>
                      </span>
                      <Icon
                        name={r.role === "admin" ? "chevronRight" : "chevronDown"}
                        size={20}
                        className={cn("shrink-0 text-navy-800/40 transition-transform", open && "rotate-180")}
                      />
                    </button>

                    {open && r.role === "student" && (
                      <div className="animate-fade-in border-t border-line/50 bg-paper/70 p-3 sm:p-4">
                        <p className="mb-2 px-1 text-xs font-semibold text-navy-800/60">Escolha um aluno fictício:</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {school.students.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => enter("student", p.id)}
                              className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-left ring-1 ring-inset ring-line/60 transition-colors hover:bg-sky-50 hover:ring-sky-300"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-head text-xs font-bold text-navy-900">
                                {p.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-navy-900">{p.name}</span>
                                <span className="block truncate text-xs text-navy-800/60">{className(p.classId)}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {open && r.role === "teacher" && (
                      <div className="animate-fade-in border-t border-line/50 bg-paper/70 p-3 sm:p-4" data-testid="subject-picker">
                        <p className="mb-2 px-1 text-xs font-semibold text-navy-800/60">Escolha a matéria que você leciona:</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {school.subjects.map((s) => {
                            const links = school.assignments.filter((a) => a.subjectId === s.id);
                            const teacher = school.teachers.find((t) => t.id === links[0]?.teacherId);
                            if (!teacher) return null;
                            const color = SUBJECT_COLORS[s.color];
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => enter("teacher", teacher.id)}
                                className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-left ring-1 ring-inset ring-line/60 transition-colors hover:bg-sky-50 hover:ring-sky-300"
                              >
                                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-extrabold ring-1 ring-inset", color.soft, color.text)}>
                                  {s.shortName}
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-bold text-navy-900">{s.name}</span>
                                  <span className="block truncate text-xs text-navy-800/60">
                                    Prof. {teacher.name} · {links.length} turma(s)
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-navy-800/65">
            <Icon name="info" size={15} className="mt-px shrink-0" />
            Ambiente de testes: não há login, senha nem banco de dados. Os dados são fictícios e voltam ao estado
            inicial quando a página é atualizada.
          </p>
          <Link href="/sobre" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:underline sm:hidden">
            Sobre o projeto <Icon name="chevronRight" size={15} />
          </Link>
        </section>

        <aside className="hidden lg:block" aria-hidden="true">
          {today && <PreviewCalendar today={today} />}
        </aside>
      </main>
    </div>
  );
}

/** Prévia decorativa do calendário, no mesmo estilo das referências. */
function PreviewCalendar({ today }: { today: string }) {
  const month = fromISODate(today);
  const weeks = buildMonthMatrix(month);
  const marks: Record<number, string> = { 4: "bg-rose-300", 9: "bg-sky-400", 15: "bg-accent", 22: "bg-violet-300", 27: "bg-sky-400" };
  return (
    <div className="relative">
      <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-navy-900" />
      <div className="animate-rise relative rounded-3xl bg-white p-6 ring-1 ring-line/70">
        <p className="mb-4 text-3xl font-extrabold uppercase tracking-tight text-navy-900">{monthTitle(month)}</p>
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="grid grid-cols-7 bg-head">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={w.full} className={cn("py-2 text-center text-[10px] font-bold uppercase text-navy-900", i < 6 && "border-r border-line")}>
                {w.short}
              </div>
            ))}
          </div>
          {weeks.map((week) => (
            <div key={week[0].iso} className="grid grid-cols-7 border-t border-line">
              {week.map((c, i) => (
                <div key={c.iso} className={cn("h-14 px-1.5 pt-1", i < 6 && "border-r border-line")}>
                  {c.inMonth && (
                    <>
                      <span
                        className={cn(
                          "inline-flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                          c.iso === today ? "bg-navy-900 text-white" : "text-navy-900",
                        )}
                      >
                        {c.day}
                      </span>
                      {marks[c.day] && <span className={cn("mt-1 block h-1.5 w-full rounded-full", marks[c.day])} />}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
