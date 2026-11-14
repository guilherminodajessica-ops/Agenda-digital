"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/dates";
import { useAppData } from "@/state/app-data-context";
import { useSession } from "@/state/session-context";
import { PageHeader } from "@/components/layout/brand";
import { Icon, type IconName } from "@/components/ui/icon";
import { AdminEvents } from "./admin-events";
import { AdminOverview } from "./admin-overview";
import { AdminStudents, AdminTeachers } from "./admin-people";
import { AdminAssignments, AdminClasses, AdminSubjects } from "./admin-structure";

const TABS = [
  { id: "visao", label: "Visão geral", icon: "grid" },
  { id: "professores", label: "Professores", icon: "user" },
  { id: "alunos", label: "Alunos", icon: "users" },
  { id: "turmas", label: "Turmas", icon: "school" },
  { id: "disciplinas", label: "Disciplinas", icon: "book" },
  { id: "vinculos", label: "Vínculos", icon: "link" },
  { id: "compromissos", label: "Compromissos", icon: "calendar" },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName }>;

type TabId = (typeof TABS)[number]["id"];

export function AdminPanel() {
  const { session } = useSession();
  const { school, today } = useAppData();
  const admin = school.admins.find((a) => a.id === session?.userId);
  const [tab, setTab] = useState<TabId>("visao");

  return (
    <>
      <PageHeader
        eyebrow={formatLongDate(today)}
        title="Administração escolar"
        description={`${admin?.name ?? ""} · ${admin?.position ?? ""}. As alterações feitas aqui são temporárias (ambiente de testes).`}
      />

      <div
        role="tablist"
        aria-label="Seções da administração"
        data-explain="Seções da administração: professores, alunos, turmas, disciplinas, vínculos entre eles e todos os compromissos."
        className="scrollbar-none -mx-4 mb-5 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition-colors",
              tab === t.id ? "bg-navy-900 text-white" : "bg-white text-navy-800 ring-1 ring-inset ring-line/70 hover:bg-sky-50",
            )}
          >
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" key={tab} className="animate-rise">
        {tab === "visao" && <AdminOverview onNavigate={(id) => setTab(id as TabId)} />}
        {tab === "professores" && <AdminTeachers />}
        {tab === "alunos" && <AdminStudents />}
        {tab === "turmas" && <AdminClasses />}
        {tab === "disciplinas" && <AdminSubjects />}
        {tab === "vinculos" && <AdminAssignments />}
        {tab === "compromissos" && <AdminEvents />}
      </div>
    </>
  );
}
