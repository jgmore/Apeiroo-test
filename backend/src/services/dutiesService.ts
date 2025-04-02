import type { Duty } from "../types/duty";
import { DutiesRepository } from "../repositories/dutiesRepository";

function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

export class DutiesService {
  private repository = new DutiesRepository();

  async getAll(): Promise<Duty[]> {
    return this.repository.getAll();
  }

  async create(name: string): Promise<Duty> {
    if (!name || name.trim().length === 0) {
      throw new Error("Name is required and cannot be empty");
    }
    return this.repository.create(name);
  }

  async update(id: string, name: string): Promise<boolean> {
    if (!name || name.trim().length === 0) {
      throw new Error("Name is required and cannot be empty");
    }
    if (!id || !isValidUUID(id)) {
      throw new Error("Invalid duty ID");
    }
    return this.repository.update(id, name);
  }

  async delete(id: string): Promise<boolean> {
    if (!id || !isValidUUID(id)) {
      throw new Error("Invalid duty ID");
    }
    return this.repository.delete(id);
  }
}
