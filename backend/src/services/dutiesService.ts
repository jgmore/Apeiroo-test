import { pool } from '../db';
import queries from '../config/queries.json';

export interface Duty {
  id: string;
  name: string;
}

export class DutiesService {
  async getAll(): Promise<Duty[]> {
    try {
      const { rows } = await pool.query(queries.getAll);
      return rows;
    } catch (err) {
      console.error('Error fetching duties:', err);
      throw new Error('Failed to fetch duties');
    }
  }

  async create(name: string): Promise<Duty> {
    try {
      const { rows } = await pool.query(queries.create, [name]);
      return rows[0];
    } catch (err) {
      console.error('Error creating duty:', err);
      throw new Error('Failed to create duty');
    }
  }

  async update(id: string, name: string): Promise<boolean> {
    try {
      const { rowCount } = await pool.query(queries.update, [name, id]);
      return rowCount > 0;
    } catch (err) {
      console.error('Error updating duty:', err);
      throw new Error('Failed to update duty');
    }
  }
}
