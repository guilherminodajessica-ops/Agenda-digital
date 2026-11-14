"use client";

/**
 * MODO EXPLICAÇÃO.
 * Ao ativar: as cores do site mudam (classe "explain-mode" no <html>) e,
 * ao passar o mouse (ou tocar) em um elemento com o atributo data-explain,
 * aparece um balão explicando o que aquele elemento faz.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PROJECT } from "@/data/project-info";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";

interface ExplainContextValue {
  active: boolean;
  toggle: () => void;
}

const ExplainContext = createContext<ExplainContextValue>({ active: false, toggle: () => undefined });

export const useExplainMode = () => useContext(ExplainContext);

interface Tip {
  text: string;
  top: number;
  left: number;
  width: number;
}

const TIP_WIDTH = 300;

function tipFor(target: Element): Tip | null {
  const el = target.closest<HTMLElement>("[data-explain]");
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const width = Math.min(TIP_WIDTH, window.innerWidth - 16);
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
  const below = rect.bottom + 10;
  const top = below + 120 > window.innerHeight ? Math.max(8, rect.top - 130) : below;
  return { text: el.dataset.explain ?? "", top, left, width };
}

export function ExplainProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const toggle = useCallback(() => setActive((v) => !v), []);

  useEffect(() => {
    document.documentElement.classList.toggle("explain-mode", active);
    if (!active) {
      setTip(null);
      return;
    }
    let last: Element | null = null;
    const show = (e: Event) => {
      last = e.target instanceof Element ? e.target : null;
      setTip(last ? tipFor(last) : null);
    };
    // Ao rolar a página, o balão acompanha o elemento.
    const hide = () => setTip(last && last.isConnected ? tipFor(last) : null);
    document.addEventListener("mouseover", show);
    document.addEventListener("focusin", show);
    document.addEventListener("touchstart", show, { passive: true });
    window.addEventListener("scroll", hide, true);
    return () => {
      document.removeEventListener("mouseover", show);
      document.removeEventListener("focusin", show);
      document.removeEventListener("touchstart", show);
      window.removeEventListener("scroll", hide, true);
      document.documentElement.classList.remove("explain-mode");
    };
  }, [active]);

  const value = useMemo(() => ({ active, toggle }), [active, toggle]);
  const video = PROJECT.explainVideoUrl;

  return (
    <ExplainContext.Provider value={value}>
      {active && (
        <div className="sticky top-0 z-40 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-navy-900 px-4 py-2 text-center text-sm font-medium text-white" data-testid="explain-banner">
          <span className="inline-flex items-center gap-2">
            <Icon name="help" size={16} /> Modo explicação ativo: passe o mouse (ou toque) nos elementos para ver o que cada um faz.
          </span>
          <button type="button" onClick={() => setVideoOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25">
            <Icon name="play" size={12} /> Vídeo de explicação
          </button>
          <button type="button" onClick={toggle} className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy-950">
            Sair do modo explicação
          </button>
        </div>
      )}

      {children}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={active}
        data-testid="explain-toggle"
        data-explain="Este botão liga e desliga o modo explicação. Com ele ligado, as cores mudam e cada parte do site mostra uma descrição."
        className={`fixed bottom-20 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-bold shadow-lg transition-colors md:bottom-6 md:right-6 ${
          active ? "bg-accent text-navy-950" : "bg-white text-navy-900 ring-1 ring-line hover:bg-sky-50"
        }`}
      >
        <Icon name="help" size={18} />
        {active ? "Explicação ligada" : "Modo explicação"}
      </button>

      {active && tip && tip.text && (
        <div
          role="tooltip"
          data-testid="explain-tip"
          className="animate-fade-in pointer-events-none fixed z-[70] rounded-xl border-2 border-accent bg-white p-3 text-sm leading-snug text-navy-900 shadow-xl"
          style={{ top: tip.top, left: tip.left, width: tip.width }}
        >
          <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-sky-700">
            <Icon name="help" size={13} /> O que é isto
          </span>
          {tip.text}
        </div>
      )}

      <Modal open={videoOpen} onClose={() => setVideoOpen(false)} title="Vídeo de explicação" size="lg">
        {video ? (
          video.endsWith(".mp4") ? (
            <video src={video} controls className="aspect-video w-full rounded-xl bg-black" />
          ) : (
            <iframe src={video} title="Vídeo de explicação" allowFullScreen className="aspect-video w-full rounded-xl border-0" />
          )
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-paper text-center">
            <Icon name="play" size={28} className="text-sky-500" />
            <p className="font-semibold text-navy-900">Vídeo ainda não adicionado</p>
            <p className="max-w-xs text-sm text-navy-800/65">O vídeo de explicação do site será incluído neste espaço.</p>
          </div>
        )}
      </Modal>
    </ExplainContext.Provider>
  );
}
