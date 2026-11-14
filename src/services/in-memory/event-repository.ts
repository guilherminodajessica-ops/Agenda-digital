import type { AcademicEvent, AcademicEventInput } from "@/types";
import { RepositoryError, type EventRepository } from "../contracts";
import { clone, getStore, newId, simulateLatency } from "./memory-store";

export class InMemoryEventRepository implements EventRepository {
  async list(): Promise<AcademicEvent[]> {
    await simulateLatency(400);
    return clone(getStore().events);
  }

  async create(teacherId: string, input: AcademicEventInput): Promise<AcademicEvent> {
    await simulateLatency();
    const now = new Date().toISOString();
    const event: AcademicEvent = { ...input, id: newId("ev"), teacherId, createdAt: now, updatedAt: now };
    getStore().events.push(event);
    return clone(event);
  }

  async update(id: string, input: AcademicEventInput): Promise<AcademicEvent> {
    await simulateLatency();
    const store = getStore();
    const index = store.events.findIndex((e) => e.id === id);
    if (index < 0) throw new RepositoryError("Compromisso não encontrado.");
    const updated: AcademicEvent = {
      ...store.events[index],
      ...input,
      time: input.time,
      dueDate: input.dueDate,
      updatedAt: new Date().toISOString(),
    };
    store.events[index] = updated;
    return clone(updated);
  }

  async remove(id: string): Promise<void> {
    await simulateLatency();
    const store = getStore();
    const before = store.events.length;
    store.events = store.events.filter((e) => e.id !== id);
    if (store.events.length === before) throw new RepositoryError("Compromisso não encontrado.");
    for (const set of store.completions.values()) set.delete(id);
  }
}
