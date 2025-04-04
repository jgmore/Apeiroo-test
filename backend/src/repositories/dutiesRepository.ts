import { pool } from "../db/db";
import { Duty } from "../types/duty";
import {DatabaseError, NotFoundError, WrongVersionError} from "../errors/customErrors";
const queries = require('../config/queries.json')

export class DutiesRepository {
    async isCurrentVersion(id: string, version: Date): Promise<boolean> {
        const currentVersion = await pool.query<{ version: Date }>(queries.getVersion, [id]);
        if (currentVersion.rows.length === 0) {
            throw new NotFoundError(`Duty not found`);
        }

        const dbVersion = currentVersion.rows[0].version;
        return version.getTime() === new Date(dbVersion).getTime();
    }

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

    async update(id: string, name: string, version : Date): Promise<boolean> {
        try {
            if (!await this.isCurrentVersion(id, version)) throw new WrongVersionError(`Duty version is not current`);
            const result = await pool.query(queries.update, [name, id]);
            if ((result.rowCount ?? 0) === 0) throw new NotFoundError(`Duty not found`);
            return true;
        } catch (err) {
            if (err instanceof NotFoundError) throw err;
            if (err instanceof WrongVersionError) throw err;
            throw new DatabaseError(`Error updating duty: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }

    async delete(id: string, version : Date): Promise<boolean> {
        try {
            if (!await this.isCurrentVersion(id, version)) throw new WrongVersionError(`Duty version is not current`);
            const result = await pool.query<Duty>(queries.delete, [id]);
            if ((result.rowCount ?? 0) === 0) throw new NotFoundError(`Duty not found`);
            return true;
        } catch (err) {
            if (err instanceof NotFoundError) throw err;
            if (err instanceof WrongVersionError) throw err;
            throw new DatabaseError(`Error deleting duty: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }
}
