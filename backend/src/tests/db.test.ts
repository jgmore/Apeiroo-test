import dotenv from "dotenv";
dotenv.config();

// Mock environment variables before importing pool
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "5432";
process.env.DB_USER = "testuser";
process.env.DB_PASSWORD = "testpassword";
process.env.DB_NAME = "testdb";

// Mock `pg` before importing `pool`
jest.mock("pg", () => {
    return {
        Pool: jest.fn().mockImplementation(() => ({
            connect: jest.fn().mockResolvedValue({ release: jest.fn() }),
            query: jest.fn().mockResolvedValue({ rows: [{ id: 1 }] }),
            end: jest.fn().mockResolvedValue(undefined),
        })),
    };
});

import { Pool } from "pg"; // Import after Jest has mocked `pg`
import { pool } from "../db/db"; // Import `pool` only after `pg` is mocked

describe("Database Pool", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should allow acquiring a client", async () => {
        const client = await pool.connect();
        expect(client).toBeDefined();
        expect(pool.connect).toHaveBeenCalledTimes(1);
    });

    test("should execute a query", async () => {
        await pool.query("SELECT 1");
        expect(pool.query).toHaveBeenCalledWith("SELECT 1");
    });

    test("should close the pool", async () => {
        await pool.end();
        expect(pool.end).toHaveBeenCalledTimes(1);
    });
});
