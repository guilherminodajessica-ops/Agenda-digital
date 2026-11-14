import type { CompletionRepository } from "../contracts";
import { getStore, simulateLatency } from "./memory-store";

export class InMemoryCompletionRepository implements CompletionRepository {
  async listAll(): Promise<Record<string, string[]>> {
    await simulateLatency(200);
    const result: Record<string, string[]> = {};
    for (const [studentId, ids] of getStore().completions) result[studentId] = [...ids];
    return result;
  }

  async setCompleted(studentId: string, eventId: string, completed: boolean): Promise<void> {
    await simulateLatency(150);
    const map = getStore().completions;
    const set = map.get(studentId) ?? new Set<string>();
    if (completed) set.add(eventId);
    else set.delete(eventId);
    map.set(studentId, set);
  }
}
