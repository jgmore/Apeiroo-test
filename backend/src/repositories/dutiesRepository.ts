import { pool } from "../db/db";
import queries from "../config/queries.json";
import { Duty } from "../types/duty";
import { DatabaseError, NotFoundError } from "../errors/customErrors";

export class DutiesRepository {
    async getAll(): Promise<Duty[]> {
        try {
            const result = await pool.query<Duty>(queries.getAll);
            return result.rows;
        } catch (err) {
            throw new DatabaseError(`Error fetching duties: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }

    async create(name: string): Promise<Duty> {
        try {
            const result = await pool.query<Duty>(queries.create, [name]);
            return result.rows[0];
        } catch (err) {
            throw new DatabaseError(`Error creating duty: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }

    async update(id: string, name: string): Promise<boolean> {
        try {
            const result = await pool.query(queries.update, [name, id]);
            if ((result.rowCount ?? 0) === 0) throw new NotFoundError(`Duty with ID ${id} not found`);
            return true;
        } catch (err) {
            if (err instanceof NotFoundError) throw err;
            throw new DatabaseError(`Error updating duty: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await pool.query<Duty>(queries.delete, [id]);
            if ((result.rowCount ?? 0) === 0) throw new NotFoundError(`Duty with ID ${id} not found`);
            return true;
        } catch (err) {
            if (err instanceof NotFoundError) throw err;
            throw new DatabaseError(`Error deleting duty: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }
}
