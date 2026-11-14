"use client";

/**
 * Sessão DEMONSTRATIVA. Guarda apenas qual perfil fictício foi escolhido,
 * em memória. Não há senha, token, cookie ou armazenamento local: ao
 * atualizar a página, é preciso escolher o perfil novamente.
 * Este mecanismo NÃO é seguro e não deve ser usado em produção.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { DemoSession, Role } from "@/types";

interface SessionContextValue {
  session: DemoSession | null;
  enterAs: (role: Role, userId: string) => void;
  leave: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const enterAs = useCallback((role: Role, userId: string) => setSession({ role, userId }), []);
  const leave = useCallback(() => setSession(null), []);
  const value = useMemo(() => ({ session, enterAs, leave }), [session, enterAs, leave]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession deve ser usado dentro de SessionProvider");
  return ctx;
}
