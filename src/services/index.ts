/**
 * Ponto único de troca da fonte de dados.
 * Para usar um banco de dados no futuro, substitua as implementações abaixo.
 */
import type { CompletionRepository, EventRepository, SchoolRepository } from "./contracts";
import { InMemoryCompletionRepository } from "./in-memory/completion-repository";
import { InMemoryEventRepository } from "./in-memory/event-repository";
import { InMemorySchoolRepository } from "./in-memory/school-repository";

export const repositories: {
  events: EventRepository;
  school: SchoolRepository;
  completions: CompletionRepository;
} = {
  events: new InMemoryEventRepository(),
  school: new InMemorySchoolRepository(),
  completions: new InMemoryCompletionRepository(),
};

export * from "./contracts";
