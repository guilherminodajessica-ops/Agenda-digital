/**
 * DADOS FICTÍCIOS DE DEMONSTRAÇÃO.
 *
 * Nenhuma informação aqui é real. As datas dos compromissos são calculadas
 * em relação ao dia atual, para que a demonstração sempre tenha uma prova
 * próxima, uma atividade vencida, um projeto futuro etc.
 */
import type {
  AcademicEvent,
  Admin,
  ISODate,
  SchoolClass,
  Student,
  Subject,
  Teacher,
  TeachingAssignment,
} from "@/types";
import { addDaysISO, fromISODate } from "@/lib/dates";

export const SCHOOL_NAME = "Escola Estadual Horizonte Azul (fictícia)";

export const admins: Admin[] = [
  {
    id: "adm-1",
    name: "Marta Albuquerque",
    email: "coordenacao@escola-teste.exemplo",
    position: "Coordenação pedagógica",
  },
];

/** Um professor por disciplina (o id segue o padrão "prof-<disciplina>"). */
export const teachers: Teacher[] = [
  { id: "prof-mat", name: "Helena Duarte", email: "helena.duarte@escola-teste.exemplo" },
  { id: "prof-fis", name: "Otávio Ramos", email: "otavio.ramos@escola-teste.exemplo" },
  { id: "prof-bio", name: "Camila Prado", email: "camila.prado@escola-teste.exemplo" },
  { id: "prof-por", name: "Ricardo Menezes", email: "ricardo.menezes@escola-teste.exemplo" },
  { id: "prof-his", name: "Lúcia Ferraz", email: "lucia.ferraz@escola-teste.exemplo" },
];

export const classes: SchoolClass[] = [
  { id: "turma-8a", name: "8º Ano A", grade: "8º ano", shift: "Manhã" },
  { id: "turma-8b", name: "8º Ano B", grade: "8º ano", shift: "Manhã" },
  { id: "turma-9a", name: "9º Ano A", grade: "9º ano", shift: "Tarde" },
];

export const subjects: Subject[] = [
  { id: "mat", name: "Matemática", shortName: "MAT", color: "sky" },
  { id: "fis", name: "Física", shortName: "FIS", color: "indigo" },
  { id: "bio", name: "Biologia", shortName: "BIO", color: "emerald" },
  { id: "por", name: "Língua Portuguesa", shortName: "POR", color: "rose" },
  { id: "his", name: "História", shortName: "HIS", color: "amber" },
];

export const students: Student[] = [
  { id: "aluno-1", name: "Ana Clara Souza", registration: "2026-0811", classId: "turma-8a" },
  { id: "aluno-2", name: "Bruno Lima", registration: "2026-0812", classId: "turma-8a" },
  { id: "aluno-3", name: "Davi Rocha", registration: "2026-0813", classId: "turma-8a" },
  { id: "aluno-4", name: "Beatriz Nogueira", registration: "2026-0821", classId: "turma-8b" },
  { id: "aluno-5", name: "Eduardo Martins", registration: "2026-0822", classId: "turma-8b" },
  { id: "aluno-6", name: "Fernanda Alves", registration: "2026-0823", classId: "turma-8b" },
  { id: "aluno-7", name: "Gabriel Teixeira", registration: "2026-0931", classId: "turma-9a" },
  { id: "aluno-8", name: "Isabela Freitas", registration: "2026-0932", classId: "turma-9a" },
];

export const assignments: TeachingAssignment[] = [
  { id: "vin-1", teacherId: "prof-mat", subjectId: "mat", classId: "turma-8a" },
  { id: "vin-2", teacherId: "prof-mat", subjectId: "mat", classId: "turma-8b" },
  { id: "vin-3", teacherId: "prof-mat", subjectId: "mat", classId: "turma-9a" },
  { id: "vin-4", teacherId: "prof-fis", subjectId: "fis", classId: "turma-9a" },
  { id: "vin-5", teacherId: "prof-bio", subjectId: "bio", classId: "turma-8b" },
  { id: "vin-6", teacherId: "prof-por", subjectId: "por", classId: "turma-8a" },
  { id: "vin-7", teacherId: "prof-por", subjectId: "por", classId: "turma-8b" },
  { id: "vin-8", teacherId: "prof-por", subjectId: "por", classId: "turma-9a" },
  { id: "vin-9", teacherId: "prof-his", subjectId: "his", classId: "turma-8a" },
  { id: "vin-10", teacherId: "prof-his", subjectId: "his", classId: "turma-9a" },
];

/** Evita fins de semana: sábado vira sexta-feira e domingo vira segunda-feira. */
function schoolDay(today: ISODate, offset: number): ISODate {
  const iso = addDaysISO(today, offset);
  const weekday = fromISODate(iso).getDay();
  if (weekday === 6) return addDaysISO(iso, -1);
  if (weekday === 0) return addDaysISO(iso, 1);
  return iso;
}

type SeedEvent = Omit<AcademicEvent, "teacherId" | "date" | "dueDate" | "createdAt" | "updatedAt"> & {
  offset: number;
  dueOffset?: number;
};

const SEED: SeedEvent[] = [
  // ---------- 8º Ano A ----------
  {
    id: "ev-1",
    title: "Prova — Equações do 1º grau",
    description:
      "Avaliação individual sobre equações do 1º grau e problemas com uma incógnita. Trazer lápis, borracha e calculadora simples.",
    subjectId: "mat", classId: "turma-8a", category: "prova",
    offset: 3, time: "08:00",
  },
  {
    id: "ev-2",
    title: "Interpretação de texto — crônicas",
    description: "Leitura de duas crônicas e resposta às questões 1 a 6 da página 84 do livro didático.",
    subjectId: "por", classId: "turma-8a", category: "atividade",
    offset: 3, time: "10:20", dueOffset: 3,
  },
  {
    id: "ev-3",
    title: "Lista de exercícios — frações",
    description: "Resolver a lista com 15 exercícios de operações com frações. Entregar no caderno.",
    subjectId: "mat", classId: "turma-8a", category: "atividade",
    offset: -10, dueOffset: -3,
  },
  {
    id: "ev-4",
    title: "Questionário — Revolução Industrial",
    description: "Responder ao questionário sobre as causas e consequências da Revolução Industrial.",
    subjectId: "his", classId: "turma-8a", category: "atividade",
    offset: -12, dueOffset: -5,
  },
  {
    id: "ev-5",
    title: "Resenha crítica de livro",
    description:
      "Escolher um livro da lista de leitura do bimestre e escrever uma resenha crítica de 20 a 30 linhas.",
    subjectId: "por", classId: "turma-8a", category: "trabalho",
    offset: -2, dueOffset: 9,
  },
  {
    id: "ev-6",
    title: "Projeto — Matemática no cotidiano",
    description:
      "Em grupos de até 4 estudantes, investigar como a matemática aparece no orçamento doméstico e apresentar um painel na mostra escolar.",
    subjectId: "mat", classId: "turma-8a", category: "projeto",
    offset: 1, dueOffset: 45,
  },
  {
    id: "ev-7",
    title: "Prova — Brasil Império",
    description: "Avaliação sobre o Primeiro e o Segundo Reinado.",
    subjectId: "his", classId: "turma-8a", category: "prova",
    offset: 16, time: "09:30",
  },
  {
    id: "ev-8",
    title: "Planejamento — revisão antes da prova",
    description: "Preparar a aula de revisão com exercícios resolvidos em dupla. (Uso interno do professor.)",
    subjectId: "mat", classId: "turma-8a", category: "planejamento",
    offset: 2,
  },
  {
    id: "ev-9",
    title: "Visita ao museu histórico",
    description: "Saída pedagógica ao museu. Trazer autorização assinada pelo responsável.",
    subjectId: "his", classId: "turma-8a", category: "outro",
    offset: 24, time: "07:30",
  },
  {
    id: "ev-10",
    title: "Prova — Orações coordenadas",
    description: "Avaliação de gramática: orações coordenadas sindéticas e assindéticas.",
    subjectId: "por", classId: "turma-8a", category: "prova",
    offset: 30, time: "08:00",
  },
  {
    id: "ev-11",
    title: "Exercícios — sistemas de equações",
    description: "Exercícios 1 a 10 da apostila, capítulo 7.",
    subjectId: "mat", classId: "turma-8a", category: "atividade",
    offset: 8, dueOffset: 10,
  },
  {
    id: "ev-12",
    title: "Prova bimestral de Matemática",
    description: "Conteúdo acumulado do bimestre.",
    subjectId: "mat", classId: "turma-8a", category: "prova",
    offset: 52, time: "08:00",
  },
  {
    id: "ev-13",
    title: "Linha do tempo — Período Regencial",
    description: "Trabalho em dupla: linha do tempo ilustrada do Período Regencial.",
    subjectId: "his", classId: "turma-8a", category: "trabalho",
    offset: -25, dueOffset: -18,
  },
  // ---------- 8º Ano B ----------
  {
    id: "ev-14",
    title: "Projeto — Horta escolar",
    description: "Planejar, plantar e acompanhar o crescimento de hortaliças, registrando observações semanais.",
    subjectId: "bio", classId: "turma-8b", category: "projeto",
    offset: 5, dueOffset: 40,
  },
  {
    id: "ev-15",
    title: "Prova — Potenciação e radiciação",
    description: "Avaliação individual.",
    subjectId: "mat", classId: "turma-8b", category: "prova",
    offset: 4, time: "10:00",
  },
  {
    id: "ev-16",
    title: "Produção de texto — carta argumentativa",
    description: "Escrever uma carta argumentativa sobre o uso do celular na escola.",
    subjectId: "por", classId: "turma-8b", category: "atividade",
    offset: -6, dueOffset: -1,
  },
  {
    id: "ev-17",
    title: "Prova — Sistema digestório",
    description: "Avaliação sobre órgãos e funções do sistema digestório.",
    subjectId: "bio", classId: "turma-8b", category: "prova",
    offset: 20, time: "09:00",
  },
  {
    id: "ev-18",
    title: "Seminário — gêneros jornalísticos",
    description: "Apresentação em grupo sobre notícia, reportagem e artigo de opinião.",
    subjectId: "por", classId: "turma-8b", category: "trabalho",
    offset: 12, dueOffset: 19,
  },
  {
    id: "ev-19",
    title: "Planejamento — sequência didática de poesia",
    description: "Organizar materiais e leituras para a próxima sequência. (Uso interno.)",
    subjectId: "por", classId: "turma-8b", category: "planejamento",
    offset: 7,
  },
  // ---------- 9º Ano A ----------
  {
    id: "ev-20",
    title: "Prova — Movimento uniforme",
    description: "Avaliação sobre velocidade média e movimento uniforme.",
    subjectId: "fis", classId: "turma-9a", category: "prova",
    offset: 2, time: "13:30",
  },
  {
    id: "ev-21",
    title: "Exercícios — função do 1º grau",
    description: "Construir os gráficos das funções da página 112.",
    subjectId: "mat", classId: "turma-9a", category: "atividade",
    offset: 6, dueOffset: 7,
  },
  {
    id: "ev-22",
    title: "Projeto — Foguete de garrafa PET",
    description: "Construir e lançar um foguete de garrafa PET, registrando altura e tempo de voo.",
    subjectId: "fis", classId: "turma-9a", category: "projeto",
    offset: -3, dueOffset: 60,
  },
  {
    id: "ev-23",
    title: "Prova — Período composto",
    description: "Avaliação de gramática.",
    subjectId: "por", classId: "turma-9a", category: "prova",
    offset: 11, time: "14:00",
  },
  {
    id: "ev-24",
    title: "Trabalho — Era Vargas",
    description: "Pesquisa em grupo sobre a Era Vargas com apresentação de cartaz.",
    subjectId: "his", classId: "turma-9a", category: "trabalho",
    offset: 15, dueOffset: 22,
  },
  {
    id: "ev-25",
    title: "Fichamento — Primeira Guerra Mundial",
    description: "Fichamento do capítulo 4 do livro didático.",
    subjectId: "his", classId: "turma-9a", category: "atividade",
    offset: -14, dueOffset: -7,
  },
  {
    id: "ev-26",
    title: "Simulado preparatório",
    description: "Simulado com questões de todas as disciplinas.",
    subjectId: "por", classId: "turma-9a", category: "outro",
    offset: 35, time: "13:00",
  },
  {
    id: "ev-27",
    title: "Prova — Equações do 2º grau",
    description: "Avaliação individual.",
    subjectId: "mat", classId: "turma-9a", category: "prova",
    offset: 70, time: "13:30",
  },
];

/** Gera os compromissos fictícios a partir da data de hoje. */
export function createSeedEvents(today: ISODate): AcademicEvent[] {
  const createdAt = new Date().toISOString();
  return SEED.map(({ offset, dueOffset, ...rest }) => {
    const date = schoolDay(today, offset);
    let dueDate = dueOffset === undefined ? undefined : schoolDay(today, dueOffset);
    if (dueDate && dueDate < date) dueDate = date;
    return { ...rest, teacherId: `prof-${rest.subjectId}`, date, dueDate, createdAt, updatedAt: createdAt };
  });
}

/** Conclusões individuais iniciais (estudante -> compromissos concluídos). */
export const seedCompletions: Record<string, string[]> = {
  "aluno-1": ["ev-4", "ev-13"],
  "aluno-2": ["ev-3", "ev-4", "ev-13"],
  "aluno-3": ["ev-13"],
  "aluno-4": ["ev-16"],
  "aluno-7": ["ev-25"],
};
