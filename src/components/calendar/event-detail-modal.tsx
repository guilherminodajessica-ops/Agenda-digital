"use client";

import type { ReactNode } from "react";
import type { AcademicEvent, StudentEventStatus } from "@/types";
import { formatLongDate } from "@/lib/dates";
import { isPrivateEvent } from "@/lib/event-rules";
import type { Lookups } from "@/state/selectors";
import { CategoryBadge, PrivateBadge, StatusBadge, SubjectTag } from "@/components/ui/badges";
import { Icon, type IconName } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";

function Row({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 py-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
        <Icon name={icon} size={16} />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-navy-800/55">{label}</dt>
        <dd className="text-sm font-semibold text-navy-900">{children}</dd>
      </div>
    </div>
  );
}

export function EventDetailModal({
  event,
  lookups,
  status,
  onClose,
  actions,
}: {
  event: AcademicEvent | null;
  lookups: Lookups;
  status?: StudentEventStatus;
  onClose: () => void;
  actions?: ReactNode;
}) {
  return (
    <Modal open={!!event} onClose={onClose} title={event?.title ?? ""} footer={event ? actions : undefined}>
      {event && (
        <div data-testid="event-detail" data-explain="Detalhes do compromisso: disciplina, professor responsável, turma, data, horário, prazo de entrega e descrição.">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <CategoryBadge category={event.category} />
            {status && <StatusBadge status={status} />}
            {isPrivateEvent(event) && <PrivateBadge />}
          </div>
          <dl className="divide-y divide-line/40">
            <Row icon="book" label="Disciplina">
              <SubjectTag subject={lookups.subject(event.subjectId)} className="text-sm" />
            </Row>
            <Row icon="user" label="Professor responsável">
              {lookups.teacher(event.teacherId)?.name ?? "—"}
            </Row>
            <Row icon="users" label="Turma">
              {lookups.schoolClass(event.classId)?.name ?? "—"}
            </Row>
            <Row icon="calendar" label="Data">
              {formatLongDate(event.date)}
            </Row>
            {event.time && (
              <Row icon="clock" label="Horário">
                {event.time}
              </Row>
            )}
            {event.dueDate && (
              <Row icon="flag" label="Prazo de entrega">
                <span className={status === "atrasada" ? "text-red-600" : undefined}>
                  {formatLongDate(event.dueDate)}
                </span>
              </Row>
            )}
          </dl>
          <div className="mt-3 rounded-xl bg-paper p-4">
            <p className="mb-1 text-xs font-medium text-navy-800/55">Descrição</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-navy-900">
              {event.description || "Sem descrição."}
            </p>
          </div>
          {isPrivateEvent(event) && (
            <p className="mt-3 flex items-center gap-2 text-xs text-navy-800/60">
              <Icon name="lock" size={13} /> Planejamento interno: não aparece para os alunos.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
