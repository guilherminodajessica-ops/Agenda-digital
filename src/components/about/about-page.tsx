"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { PROJECT, SOURCES, TOOL_VERSIONS } from "@/data/project-info";
import { CATEGORIES } from "@/lib/categories";
import { hexToRgb, toBinary8 } from "@/lib/color";
import { categoryCountsCsv, downloadText, eventsToCsv } from "@/lib/csv";
import { useAppData } from "@/state/app-data-context";
import { createLookups } from "@/state/selectors";
import { useSession } from "@/state/session-context";
import { DemoBadge, Logo } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { LoadingState } from "@/components/ui/spinner";

const HOME = { student: "/aluno", teacher: "/professor", admin: "/admin" } as const;

const PALETTE = [
  { name: "Azul-marinho (títulos e botões)", hex: "#14213d" },
  { name: "Azul (ações e destaques)", hex: "#3b78ea" },
  { name: "Azul-claro (cabeçalho do calendário)", hex: "#e4eeff" },
  { name: "Azul das linhas da grade", hex: "#b9d1f5" },
  { name: "Âmbar (acento)", hex: "#fca311" },
];

const TIMELINE = [
  { year: "1989", text: "Tim Berners-Lee escreve, no CERN, a primeira proposta da World Wide Web.", source: 1 },
  { year: "1990", text: "O primeiro servidor e o primeiro navegador da Web entram em funcionamento no CERN.", source: 1 },
  { year: "1991", text: "O programa da Web é liberado: navegador em modo de linha, servidor e biblioteca para desenvolvedores.", source: 1 },
  { year: "1994", text: "É fundado o World Wide Web Consortium (W3C), que mantém os padrões da Web, como HTML e CSS.", source: 1 },
  { year: "1996", text: "A linguagem de estilos CSS, nível 1, torna-se Recomendação do W3C em 17 de dezembro.", source: 2 },
  { year: "2026", text: "Este site: HTML, CSS e JavaScript em um único arquivo, gerado com React 19.2.8 e Tailwind CSS 4.3.3.", source: 0 },
];

function Section({ id, n, title, block, icon, children }: { id: string; n: string; title: string; block?: string; icon: IconName; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 rounded-3xl border border-line/70 bg-white p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-head text-navy-900">
          <Icon name={icon} size={19} />
        </span>
        <h2 className="text-xl font-extrabold tracking-tight text-navy-900">
          <span className="mr-2 text-sky-500">{n}</span>
          {title}
        </h2>
        {block && (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-navy-900 ring-1 ring-inset ring-accent/50">
            {block}
          </span>
        )}
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-navy-800">{children}</div>
    </section>
  );
}

/** Animação em CSS: o compromisso sai do professor e aparece no calendário da turma. */
function FlowAnimation() {
  return (
    <div className="relative h-40 overflow-hidden rounded-2xl border border-line bg-paper" data-testid="flow-animation" role="img" aria-label="Animação: o professor lança um compromisso e ele aparece no calendário do aluno.">
      <div className="flow-pulse absolute left-[4%] top-1/2 flex w-[22%] -translate-y-1/2 flex-col items-center gap-1 rounded-2xl bg-navy-900 px-2 py-4 text-center text-white">
        <Icon name="book" size={22} />
        <span className="text-xs font-bold">Professor</span>
        <span className="text-[10px] text-white/70">lança a data</span>
      </div>
      <div className="absolute left-[28%] right-[30%] top-1/2 border-t-2 border-dashed border-line" />
      <div className="flow-chip absolute top-[calc(50%-14px)] rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-800 shadow">
        Prova · 8º A
      </div>
      <div className="absolute right-[4%] top-1/2 w-[24%] -translate-y-1/2 overflow-hidden rounded-xl border border-line bg-white">
        <div className="bg-head py-1 text-center text-[10px] font-bold uppercase text-navy-900">Calendário</div>
        <div className="grid grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={`h-8 border-l border-t border-line text-[9px] font-semibold text-navy-900 first:border-l-0 ${i === 5 ? "flow-cell" : ""}`}>
              <span className="pl-1">{i + 12}</span>
              {i === 5 && <span className="mx-1 block h-1 rounded-full bg-rose-400" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AboutPage() {
  const { session } = useSession();
  const { status, school, events } = useAppData();
  const lookups = useMemo(() => createLookups(school), [school]);
  const back = session ? HOME[session.role] : "/";
  const publicEvents = events.filter((e) => e.category !== "planejamento").length;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo compact />
          <div className="flex items-center gap-2">
            <DemoBadge short />
            <Link href={back} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-navy-900 px-3 text-sm font-semibold text-white hover:bg-navy-800">
              <Icon name="arrowLeft" size={16} /> Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-8 pb-28 sm:px-6">
        <div className="rounded-3xl bg-navy-900 p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Sobre o projeto · {PROJECT.profile}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Agenda Digital Escolar</h1>
          <p className="mt-4 border-l-4 border-accent pl-4 text-lg font-medium leading-snug" data-testid="objective">
            <span className="block text-xs font-bold uppercase tracking-wide text-white/65">Objetivo</span>
            {PROJECT.objective}
          </p>
          <dl className="mt-5 grid gap-x-6 gap-y-1 text-sm text-white/80 sm:grid-cols-2">
            {PROJECT.author && <div><dt className="inline font-semibold text-white">Autor: </dt><dd className="inline">{PROJECT.author}</dd></div>}
            <div><dt className="inline font-semibold text-white">Disciplina: </dt><dd className="inline">{PROJECT.discipline}</dd></div>
            <div><dt className="inline font-semibold text-white">Curso: </dt><dd className="inline">{PROJECT.course}</dd></div>
            <div><dt className="inline font-semibold text-white">Professor: </dt><dd className="inline">{PROJECT.teacher}</dd></div>
          </dl>
        </div>

        <Section id="problema" n="1" title="Problema" icon="alert">
          <p>
            As datas de provas, trabalhos e atividades de uma turma são informadas por meios diferentes: quadro da sala,
            caderno e mensagens. O aluno precisa reunir essas datas por conta própria, e um prazo anotado em um só lugar
            pode ser esquecido.
          </p>
          <p>
            O site reúne essas datas em um calendário por turma. O professor cadastra o compromisso uma vez e todos os
            alunos da turma consultam a mesma informação.
          </p>
        </Section>

        <Section id="animacao" n="2" title="Como funciona (animação)" icon="play">
          <p>A animação abaixo, feita em CSS, representa o caminho de um compromisso: do lançamento pelo professor até o calendário dos alunos da turma. Ela não tem som.</p>
          <FlowAnimation />
        </Section>

        <Section id="processo" n="3" title="Processo" icon="list">
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Definição do objetivo e das três áreas do site: aluno, professor e administração.</li>
            <li>Escolha das imagens de calendário usadas como referência visual (título do mês, cabeçalho azul-claro, linhas finas).</li>
            <li>Redação de uma especificação com as funções de cada área e a restrição de não usar banco de dados.</li>
            <li>Geração do código com inteligência artificial a partir da especificação e das imagens.</li>
            <li>Testes automatizados no navegador e revisão das telas pelo autor, que pediu alterações de logotipo, cores, painéis e acesso do professor por disciplina.</li>
          </ol>
          <p className="font-semibold text-navy-900">Programas e versões</p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-head text-navy-900">
                <tr><th className="px-3 py-2">Programa</th><th className="px-3 py-2">Versão</th><th className="px-3 py-2">Uso</th></tr>
              </thead>
              <tbody>
                {TOOL_VERSIONS.map((t) => (
                  <tr key={t.name} className="border-t border-line/60">
                    <td className="px-3 py-2 font-semibold text-navy-900">{t.name}</td>
                    <td className="px-3 py-2">{t.version}</td>
                    <td className="px-3 py-2">{t.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {PROJECT.equipment && <p><strong className="text-navy-900">Equipamento:</strong> {PROJECT.equipment}</p>}
        </Section>

        <Section id="resultado" n="4" title="Resultado" icon="check">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
              <p className="mb-2 font-bold text-emerald-800">Implementado</p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Calendário mensal com navegação por mês e ano e filtros por disciplina e categoria.</li>
                <li>Área do aluno: próximos compromissos, atrasos e marcação individual de conclusão.</li>
                <li>Área do professor: lançar, editar e excluir compromissos por sala; planejamentos privados.</li>
                <li>Área da administração: professores, alunos, turmas, disciplinas e vínculos.</li>
                <li>Versão para celular e modo explicação.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-accent-soft p-4 ring-1 ring-inset ring-accent/50">
              <p className="mb-2 font-bold text-navy-900">Incompleto</p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Não há banco de dados: o que é cadastrado some quando a página é atualizada.</li>
                <li>Não há login real: qualquer pessoa escolhe qualquer perfil.</li>
                <li>Os dados (escola, pessoas e compromissos) são fictícios.</li>
                <li>A animação não tem som; a análise de áudio (bloco 2A) não faz parte do site.</li>
                <li>O gráfico no Datawrapper não está incorporado; o site fornece o arquivo CSV para criá-lo.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="historia" n="5" title="Da primeira página da Web a este site" block="Bloco 1A" icon="clock">
          <ol className="relative ml-2 space-y-3 border-l-2 border-line pl-5">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-white" />
                <span className="font-extrabold text-navy-900">{t.year}</span> — {t.text}
                {t.source > 0 && <sup className="ml-0.5 font-bold text-sky-700">[{t.source}]</sup>}
              </li>
            ))}
          </ol>
        </Section>

        <Section id="cores" n="6" title="As cores do site em hexadecimal, decimal e binário" block="Blocos 1B e 1D" icon="grid">
          <p>
            Cada cor é guardada como três números de 8 bits (vermelho, verde e azul), de 0 a 255. O código hexadecimal
            escreve cada número com dois dígitos. Os valores abaixo são calculados pelo próprio site a partir do código
            hexadecimal declarado no arquivo de estilos (<code>src/app/globals.css</code>).
          </p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm" data-testid="color-table">
              <thead className="bg-head text-navy-900">
                <tr><th className="px-3 py-2">Cor</th><th className="px-3 py-2">Hexadecimal</th><th className="px-3 py-2">RGB (decimal)</th><th className="px-3 py-2">Binário (R G B)</th></tr>
              </thead>
              <tbody>
                {PALETTE.map((c) => {
                  const rgb = hexToRgb(c.hex);
                  return (
                    <tr key={c.hex} className="border-t border-line/60">
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-2 font-semibold text-navy-900">
                          <span className="h-5 w-5 shrink-0 rounded-md ring-1 ring-inset ring-black/10" style={{ backgroundColor: c.hex }} />
                          {c.name}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono">{c.hex}</td>
                      <td className="px-3 py-2 font-mono">{rgb.join(", ")}</td>
                      <td className="px-3 py-2 font-mono text-xs">{rgb.map(toBinary8).join(" ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="logica" n="7" title="Categorias e operadores lógicos" block="Bloco 3B" icon="filter">
          <p>Cada compromisso tem uma categoria (dado categórico): {CATEGORIES.map((c) => c.label).join(", ")}. O site decide o que mostrar com condições compostas:</p>
          <ul className="space-y-2">
            <li className="rounded-xl bg-paper p-3 font-mono text-[13px]">
              aluno vê o compromisso = (turma do compromisso = turma do aluno) <strong>E</strong> <strong>NÃO</strong> (categoria = Planejamento)
            </li>
            <li className="rounded-xl bg-paper p-3 font-mono text-[13px]">
              passa no filtro = (nenhuma disciplina marcada <strong>OU</strong> disciplina está marcada) <strong>E</strong> (nenhuma categoria marcada <strong>OU</strong> categoria está marcada)
            </li>
            <li className="rounded-xl bg-paper p-3 font-mono text-[13px]">
              prazo vencido = (é entrega) <strong>E</strong> <strong>NÃO</strong> (concluída) <strong>E</strong> (data-limite &lt; hoje)
            </li>
          </ul>
          <p className="text-sm">Essas regras estão no arquivo <code>src/lib/event-rules.ts</code> do código-fonte.</p>
        </Section>

        <Section id="dados" n="8" title="Dados em CSV e resumo em infográfico" block="Blocos 3C e 3D" icon="download">
          {status !== "ready" ? (
            <LoadingState />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="infographic">
                {[
                  [school.classes.length, "turmas"],
                  [school.subjects.length, "disciplinas, uma por professor"],
                  [school.students.length, "alunos fictícios"],
                  [events.length, "compromissos cadastrados"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-navy-900 p-4 text-white">
                    <p className="text-3xl font-extrabold leading-none">{value}</p>
                    <p className="mt-1.5 text-xs text-white/75">{label}</p>
                  </div>
                ))}
              </div>
              <div className="grid items-stretch gap-2 text-center text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
                <div className="rounded-2xl border border-line p-3"><Icon name="book" size={20} className="mx-auto mb-1 text-sky-600" /><strong className="block text-navy-900">Professor</strong>lança o compromisso para uma sala</div>
                <Icon name="chevronRight" size={20} className="hidden self-center text-navy-800/40 sm:block" />
                <div className="rounded-2xl border border-line p-3"><Icon name="grid" size={20} className="mx-auto mb-1 text-sky-600" /><strong className="block text-navy-900">Estado compartilhado</strong>guarda os dados na memória da página</div>
                <Icon name="chevronRight" size={20} className="hidden self-center text-navy-800/40 sm:block" />
                <div className="rounded-2xl border border-line p-3"><Icon name="calendar" size={20} className="mx-auto mb-1 text-sky-600" /><strong className="block text-navy-900">Aluno</strong>vê {publicEvents} dos {events.length} compromissos; os planejamentos ficam ocultos</div>
              </div>
              <p>
                Os compromissos podem ser exportados em CSV (valores separados por vírgula) e reutilizados em outra
                ferramenta, como uma planilha ou o Datawrapper. Os valores são contados pelo site a partir dos dados fictícios.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button icon="download" onClick={() => downloadText("compromissos.csv", eventsToCsv(events, lookups))} data-testid="csv-events" data-explain="Baixa um arquivo CSV com todos os compromissos: título, categoria, disciplina, turma, professor, data, horário e entrega.">
                  Baixar compromissos.csv
                </Button>
                <Button variant="secondary" icon="download" onClick={() => downloadText("categorias.csv", categoryCountsCsv(events))} data-explain="Baixa um CSV com a quantidade de compromissos por categoria, pronto para um gráfico de barras.">
                  Baixar categorias.csv
                </Button>
              </div>
            </>
          )}
        </Section>

        <Section id="ia" n="9" title="Uso de inteligência artificial e fontes" icon="info">
          <p data-testid="ai-declaration">
            <strong className="text-navy-900">Declaração:</strong> o código deste site foi gerado com o assistente de
            inteligência artificial Claude, da Anthropic, a partir da especificação escrita pelo autor, das imagens de
            referência do calendário e das alterações pedidas por ele. Os textos desta página foram redigidos com a mesma
            ferramenta. Os testes automatizados também foram executados por ela.
          </p>
          <p className="font-semibold text-navy-900">Fontes consultadas</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {SOURCES.map((s) => (
              <li key={s.url}>
                {s.label} Disponível em: <a href={s.url} target="_blank" rel="noreferrer" className="break-all font-medium text-sky-700 underline">{s.url}</a>. Acesso em: 13 nov. 2026.
              </li>
            ))}
          </ol>
          <p className="text-sm">A fonte [1] sustenta os itens de 1989 a 1994 da linha do tempo; as fontes [2] e [3], o item de 1996.</p>
        </Section>
      </main>
    </div>
  );
}
