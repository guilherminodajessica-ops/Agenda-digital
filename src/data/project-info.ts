/**
 * Informações do trabalho exibidas na página "Sobre o projeto".
 * Preencha os campos vazios; campos vazios não são exibidos.
 */
export const PROJECT = {
  author: "Guilherme Henrique Ribeiro Coutinho",
  course: "Curso Técnico de Informática — CEFET-MG, Campus Divinópolis",
  discipline: "Fundamentos de Informática — 1º B",
  teacher: "Prof. Alberto Pena Lara",
  profile: "Perfil A — site com animação incorporada",
  objective:
    "Criar um site de agenda escolar em que os professores lançam provas, trabalhos, atividades e projetos e os alunos de cada turma consultam essas datas em um único calendário.",
  /** Ex.: "Notebook X, processador Y, 8 GB de RAM, Windows 11". */
  equipment: "",
  /** Endereço do vídeo de explicação (YouTube "embed" ou arquivo .mp4). Vazio = ainda não adicionado. */
  explainVideoUrl: "",
};

/** Versões dos programas usados para gerar e testar o arquivo do site. */
export const TOOL_VERSIONS = [
  { name: "React", version: "19.2.8", use: "componentes interativos" },
  { name: "TypeScript", version: "6.0.3", use: "tipos e verificação do código" },
  { name: "Tailwind CSS", version: "4.3.3", use: "estilos" },
  { name: "esbuild", version: "0.28.2", use: "empacotamento em um único arquivo HTML" },
  { name: "Playwright (Chromium)", version: "1.63.0", use: "testes automatizados no navegador" },
  { name: "Next.js e date-fns", version: "declarados no package.json", use: "estrutura e datas no projeto-fonte" },
];

export const SOURCES = [
  {
    label: "CERN. A short history of the Web.",
    url: "https://home.cern/science/computing/the-birth-of-the-web/short-history-web/",
  },
  {
    label: "W3C. CSS history.",
    url: "https://www.w3.org/Style/CSS/history.html",
  },
  {
    label: "W3C. Cascading Style Sheets, level 1 — publication history.",
    url: "https://www.w3.org/standards/history/CSS1/",
  },
];
