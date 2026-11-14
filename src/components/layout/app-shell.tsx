"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { Role } from "@/types";
import { cn } from "@/lib/cn";
import { useAppData } from "@/state/app-data-context";
import { useSession } from "@/state/session-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon, type IconName } from "@/components/ui/icon";
import { LoadingState } from "@/components/ui/spinner";
import { DemoBadge, Logo } from "./brand";

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

const NAV: Record<Role, NavItem[]> = {
  student: [
    { href: "/aluno", label: "Início", icon: "home" },
    { href: "/aluno/calendario", label: "Calendário", icon: "calendar" },
  ],
  teacher: [
    { href: "/professor", label: "Início", icon: "home" },
    { href: "/professor/compromissos", label: "Compromissos", icon: "list" },
    { href: "/professor/calendario", label: "Calendário", icon: "calendar" },
  ],
  admin: [{ href: "/admin", label: "Painel", icon: "grid" }],
};

const ABOUT: NavItem = { href: "/sobre", label: "Sobre", icon: "info" };
const withAbout = (items: NavItem[]) => [...items, ABOUT];

const ROLE_LABEL: Record<Role, string> = {
  student: "Aluno(a)",
  teacher: "Professor(a)",
  admin: "Administração",
};

/** Nome do usuário fictício da sessão atual. */
function useSessionUserName(): string {
  const { session } = useSession();
  const { school } = useAppData();
  if (!session) return "";
  const list =
    session.role === "student" ? school.students : session.role === "teacher" ? school.teachers : school.admins;
  return list.find((u) => u.id === session.userId)?.name ?? "";
}

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const { session, leave } = useSession();
  const { status, error, reload } = useAppData();
  const pathname = usePathname();
  const router = useRouter();
  const name = useSessionUserName();
  const nav = withAbout(NAV[role]);

  const switchProfile = () => {
    leave();
    router.push("/");
  };

  if (!session || session.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-line/70 bg-white shadow-sm">
          <EmptyState
            icon="user"
            title="Escolha um perfil para continuar"
            description="Esta área exige a seleção de um perfil. Como este é um ambiente de testes sem login real, a escolha não é guardada ao atualizar a página."
            action={
              <Link
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Ir para a tela de acesso
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-36 md:pb-20">
      <header className="sticky top-0 z-30 bg-navy-900 text-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Logo compact onDark />
          <span className="hidden xl:block"><DemoBadge /></span>
          <span className="xl:hidden"><DemoBadge short /></span>
          <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Navegação principal" data-explain="Menu da área: leva às páginas disponíveis para o perfil escolhido.">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition-colors",
                    active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon name={item.icon} size={17} />
                  <span className={active ? undefined : "hidden lg:inline"}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden whitespace-nowrap text-right leading-tight lg:block" data-explain="Perfil fictício em uso nesta sessão de testes.">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs text-white/65">{ROLE_LABEL[role]}</p>
            </div>
            <button
              type="button"
              onClick={switchProfile}
              data-explain="Sai do perfil atual e volta para a tela de escolha de perfil."
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/10 px-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20"
            >
              <Icon name="logout" size={16} />
              <span className="hidden sm:inline">Trocar perfil</span>
              <span className="sm:hidden">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <EmptyState
            icon="alert"
            title="Não foi possível carregar os dados"
            description={error ?? undefined}
            action={<Button onClick={reload}>Tentar novamente</Button>}
          />
        )}
        {status === "ready" && <div className="animate-rise">{children}</div>}
      </main>

      {(
        <nav
          aria-label="Navegação inferior"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line/60 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        >
          <div className="grid" style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}>
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                    active ? "text-navy-900" : "text-navy-800/50",
                  )}
                >
                  <span className={cn("flex h-7 w-12 items-center justify-center rounded-full", active && "bg-head")}>
                    <Icon name={item.icon} size={19} />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
