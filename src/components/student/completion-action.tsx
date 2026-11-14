"use client";

import { useState } from "react";
import type { AcademicEvent } from "@/types";
import { isDeliverable } from "@/lib/event-rules";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

/** Botão de conclusão individual exibido na janela de detalhes. */
export function CompletionAction({
  event,
  completed,
  onToggle,
  onClose,
}: {
  event: AcademicEvent;
  completed: boolean;
  onToggle: (eventId: string, done: boolean) => Promise<void>;
  onClose: () => void;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  if (!isDeliverable(event)) {
    return (
      <Button variant="secondary" onClick={onClose}>
        Fechar
      </Button>
    );
  }

  const handle = async () => {
    setBusy(true);
    try {
      await onToggle(event.id, !completed);
      toast(
        completed
          ? "Marcação removida. A atividade voltou para pendentes."
          : "Atividade marcada como concluída (somente na sua agenda).",
      );
    } catch {
      toast("Não foi possível atualizar a atividade. Tente novamente.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={onClose}>
        Fechar
      </Button>
      <Button
        variant={completed ? "soft" : "primary"}
        icon={completed ? "x" : "check"}
        loading={busy}
        onClick={handle}
        data-testid="toggle-complete"
        data-explain="Marca a atividade como concluída apenas para este aluno. O compromisso original e os outros alunos não são alterados."
      >
        {completed ? "Desmarcar conclusão" : "Marcar como concluída"}
      </Button>
    </>
  );
}
