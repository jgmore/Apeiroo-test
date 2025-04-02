import { DutiesRepository } from "../repositories/dutiesRepository";
import { pool } from "../db/db";

jest.mock("../db/db", () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe("Duties Repository", () => {
    let dutiesRepository: DutiesRepository;
    const mockDate = new Date();

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

    test("should update a duty from repository", async () => {
        (pool.query as jest.Mock).mockResolvedValue({rowCount: 1, rows: [{ id: "1", name: "New Duty", version: mockDate }] });
        const result = await dutiesRepository.update("1", "New Duty",mockDate);
        expect(result).toBe(true);
    });

    test("should throw NotFoundError if duty to update is not found", async () => {
        (pool.query as jest.Mock).mockResolvedValue({rowCount: 0, rows: [{ id: "1", name: "New Duty", version: mockDate }] });
        await expect(dutiesRepository.update("999", "New Duty",mockDate)).rejects.toThrow("Duty not found");
    });

    test("should throw WrongVersionError if version of the duty to update is not found", async () => {
        (pool.query as jest.Mock).mockResolvedValue({rowCount: 0, rows: [{ id: "1", name: "New Duty", version: mockDate }] });
        await expect(dutiesRepository.update("1", "New Duty",new Date(2020,1,1))).rejects.toThrow("Duty version is not current");
    });

    test("should delete a duty from repository", async () => {
        (pool.query as jest.Mock).mockResolvedValue({rowCount: 1, rows: [{ id: "1", name: "New Duty", version: mockDate }] });
        const result = await dutiesRepository.delete("1",mockDate);
        expect(result).toBe(true);
    });

    test("should throw NotFoundError if duty to delete is not found", async () => {
        (pool.query as jest.Mock).mockResolvedValue({rowCount: 0, rows: [{ id: "1", name: "New Duty", version: mockDate }] });
        await expect(dutiesRepository.delete("999",mockDate)).rejects.toThrow("Duty not found");
    });

    test("should throw WrongVersionError if version of the duty to delete is not found", async () => {
        (pool.query as jest.Mock).mockResolvedValue({rowCount: 0, rows: [{ id: "1", name: "New Duty", version: mockDate }] });
        await expect(dutiesRepository.delete("1", new Date(2020,1,1))).rejects.toThrow("Duty version is not current");
    });
});
