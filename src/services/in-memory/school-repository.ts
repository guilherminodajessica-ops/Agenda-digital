import type { Student, Teacher, TeachingAssignment } from "@/types";
import { RepositoryError, type SchoolRepository, type SchoolSnapshot } from "../contracts";
import { clone, getStore, newId, simulateLatency } from "./memory-store";

export class InMemorySchoolRepository implements SchoolRepository {
  async snapshot(): Promise<SchoolSnapshot> {
    await simulateLatency(300);
    return clone(getStore().school);
  }

  async updateTeacher(id: string, patch: Pick<Teacher, "name" | "email">): Promise<Teacher> {
    await simulateLatency();
    const teacher = getStore().school.teachers.find((t) => t.id === id);
    if (!teacher) throw new RepositoryError("Professor não encontrado.");
    Object.assign(teacher, patch);
    return clone(teacher);
  }

  async updateStudent(id: string, patch: Pick<Student, "name" | "classId">): Promise<Student> {
    await simulateLatency();
    const school = getStore().school;
    const student = school.students.find((s) => s.id === id);
    if (!student) throw new RepositoryError("Aluno não encontrado.");
    if (!school.classes.some((c) => c.id === patch.classId)) throw new RepositoryError("Turma inválida.");
    Object.assign(student, patch);
    return clone(student);
  }

  async addAssignment(data: Omit<TeachingAssignment, "id">): Promise<TeachingAssignment> {
    await simulateLatency();
    const school = getStore().school;
    const exists = school.assignments.some(
      (a) => a.teacherId === data.teacherId && a.subjectId === data.subjectId && a.classId === data.classId,
    );
    if (exists) throw new RepositoryError("Este vínculo já existe.");
    const taken = school.assignments.find((a) => a.subjectId === data.subjectId && a.classId === data.classId);
    if (taken) throw new RepositoryError("Esta disciplina já tem professor nesta turma.");
    const assignment: TeachingAssignment = { ...data, id: newId("vin") };
    school.assignments.push(assignment);
    return clone(assignment);
  }

  async removeAssignment(id: string): Promise<void> {
    await simulateLatency();
    const school = getStore().school;
    school.assignments = school.assignments.filter((a) => a.id !== id);
  }
}
