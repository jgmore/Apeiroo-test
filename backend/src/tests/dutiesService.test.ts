import { DutiesService } from "../services/dutiesService";
import { DutiesRepository } from "../repositories/dutiesRepository";
import type { Duty } from "../types/duty";

jest.mock("../repositories/dutiesRepository");

describe("DutiesService", () => {
    let service: DutiesService;
    let mockRepository: jest.Mocked<DutiesRepository>;
    const mockDate : Date = new Date();
    const mockId : string = "274b6d20-7f47-41b3-a043-1e4eb9f7b88b";

    beforeEach(() => {
        mockRepository = new DutiesRepository() as jest.Mocked<DutiesRepository>;
        service = new DutiesService();
        (service as any).repository = mockRepository; // Inject mock repository
    });

    test("should fetch all duties", async () => {
        const duties: Duty[] = [{ id: "1", name: "Test Duty", version: mockDate }];
        mockRepository.getAll.mockResolvedValue(duties);

        const result = await service.getAll();

        expect(result).toEqual(duties);
        expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });

    test("should save a duty", async () => {
        const newDuty: Duty = { id: "1", name: "New Duty", version: mockDate };
        mockRepository.create.mockResolvedValue(newDuty);

        const result = await service.create("New Duty");

        expect(result).toEqual(newDuty);
        expect(mockRepository.create).toHaveBeenCalledWith("New Duty");
    });

    test("should fail to save a duty with an empty name", async () => {
        await expect(service.create("")).rejects.toThrow("Name is required and cannot be empty");
        await expect(service.create("   ")).rejects.toThrow("Name is required and cannot be empty");
    });

    test("should update a duty", async () => {
        mockRepository.update.mockResolvedValue(true);

        const result = await service.update(mockId, "Updated Duty", mockDate);

        expect(result).toBe(true);
        expect(mockRepository.update).toHaveBeenCalledWith(mockId, "Updated Duty", mockDate);
    });

    test("should fail to update a duty with an invalid ID", async () => {
        await expect(service.update("", "Updated Duty",mockDate)).rejects.toThrow("Invalid duty ID");
        await expect(service.update("abc", "Updated Duty",mockDate)).rejects.toThrow("Invalid duty ID");
    });

    test("should fail to update a duty with wrong version", async () => {
        await expect(service.update("", "Updated Duty",mockDate)).rejects.toThrow("Invalid duty ID");
        await expect(service.update("abc", "Updated Duty",mockDate)).rejects.toThrow("Invalid duty ID");
    });

    test("should delete a duty", async () => {
        mockRepository.delete.mockResolvedValue(true);
        const result = await service.delete(mockId,mockDate);
        expect(result).toBe(true);
        expect(mockRepository.delete).toHaveBeenCalledWith(mockId,mockDate);
    });

    test("should fail to delete a duty with an invalid ID", async () => {
        await expect(service.delete("abc",mockDate)).rejects.toThrow("Invalid duty ID");
    });
});
