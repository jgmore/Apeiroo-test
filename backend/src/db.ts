import { Pool } from 'pg';

export const pool = new Pool({
  user: 'user01',
  host: 'dpg-cvipfqpr0fns738k5tmg-a.frankfurt-postgres.render.com',
  database: 'apeiroo',
  password: 'Nji1644fkbzO7VzN2PMjfY7PbsmyZVjT',
  port: 5432,
});