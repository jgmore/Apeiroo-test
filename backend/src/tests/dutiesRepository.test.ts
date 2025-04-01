import { DutiesRepository } from "../repositories/dutiesRepository";
import { pool } from "../db/db";

jest.mock("../db/db", () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe("Duties Repository", () => {
    let dutiesRepository: DutiesRepository;

    beforeEach(() => {
        dutiesRepository = new DutiesRepository();
        jest.clearAllMocks();
    });

    test("should fetch all duties from repository", async () => {
        (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: "1", name: "Test Duty" }] });
        const result = await dutiesRepository.getAll();
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("id", "1");
        expect(result[0]).toHaveProperty("name", "Test Duty");
    });

    test("should store a duty in repository", async () => {
        (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: "1", name: "New Duty" }] });
        const result = await dutiesRepository.create("New Duty");
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id", "1");
        expect(result).toHaveProperty("name", "New Duty");
    });

});
