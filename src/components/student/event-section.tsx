"use client";

import { useState } from "react";
import type { AcademicEvent, ISODate, StudentEventStatus } from "@/types";
import type { Lookups } from "@/state/selectors";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { IconName } from "@/components/ui/icon";
import { EventListItem } from "@/components/calendar/event-list-item";

/** Card com uma lista de compromissos e estado vazio. */
export function EventSection({
  title,
  icon,
  tone,
  events,
  lookups,
  today,
  statusOf,
  emptyTitle,
  emptyDescription,
  limit = 5,
  showClass,
  dateMode,
  onOpen,
  testId,
}: {
  title: string;
  icon: IconName;
  tone?: "default" | "danger" | "success";
  events: AcademicEvent[];
  lookups: Lookups;
  today: ISODate;
  statusOf?: (e: AcademicEvent) => StudentEventStatus;
  emptyTitle: string;
  emptyDescription?: string;
  limit?: number;
  showClass?: boolean;
  dateMode?: "deadline" | "date";
  onOpen: (e: AcademicEvent) => void;
  testId?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? events : events.slice(0, limit);
  return (
    <Card data-testid={testId}>
      <CardHeader
        title={title}
        icon={icon}
        tone={tone}
        count={events.length}
        action={
          events.length > limit ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-semibold text-sky-700 hover:underline"
            >
              {expanded ? "Mostrar menos" : "Ver todas"}
            </button>
          ) : undefined
        }
      />
      {events.length === 0 ? (
        <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="flex flex-col gap-0.5 p-2">
          {shown.map((e) => (
            <EventListItem
              key={e.id}
              event={e}
              lookups={lookups}
              today={today}
              status={statusOf?.(e)}
              showClass={showClass}
              dateMode={dateMode}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
