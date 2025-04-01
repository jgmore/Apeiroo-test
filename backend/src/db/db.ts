import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config({ path: "./src/.env" });

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432, // Ensure it's a number
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  idleTimeoutMillis: 30000,
  ssl: true
});