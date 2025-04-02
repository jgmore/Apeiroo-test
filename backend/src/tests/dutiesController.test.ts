import { DutiesController } from "../controllers/dutiesController";
import { DutiesService } from "../services/dutiesService";
import { Request, Response } from "express";

describe("Duties Controller", () => {
    let dutiesController: DutiesController;
    let mockDutiesService: Partial<DutiesService>;

    beforeEach(() => {
        mockDutiesService = {
            getAll: jest.fn().mockResolvedValue([{ id: "1", name: "Test Duty" }]),
            create: jest.fn().mockResolvedValue({ id: "1", name: "New Duty" }),
            update: jest.fn().mockResolvedValue({ id: "1", name: "Updated Duty" }),
            delete: jest.fn().mockResolvedValue({ id: "1" }),
        };
        dutiesController = new DutiesController(mockDutiesService as DutiesService);
    });

    test("should get all duties", async () => {
        const req = {} as Request;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
        await dutiesController.getAll(req, res);
        expect(mockDutiesService.getAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: "1", name: "Test Duty" }]);
    });

    test("should create a duty", async () => {
        const req = { body: { name: "New Duty" } } as Request;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
        await dutiesController.create(req, res);
        expect(mockDutiesService.create).toHaveBeenCalledWith("New Duty");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: "1", name: "New Duty" });
    });

    test("should return 400 if name is missing creating a duty", async () => {
        const req = { body: {} } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;
        await dutiesController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Missing 'name' in request body");
    });

    test("should return 500 on error creating a duty", async () => {
        mockDutiesService.create = jest.fn().mockRejectedValue(new Error("Database failure"));
        const req = { body: { name: "New Duty" } } as unknown as Request;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
        await dutiesController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({"error": "Error creating duty: Database failure"});
    });

    test("should update a duty", async () => {
        const req = { params: { id: "1" }, body: { name: "Updated Duty" } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            sendStatus: jest.fn()
        } as unknown as Response;
        await dutiesController.update(req, res);
        expect(mockDutiesService.update).toHaveBeenCalledWith("1", "Updated Duty");
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    test("should return 400 if name is missing updating a duty", async () => {
        const req = { params: { id: "1" }, body: {} } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;
        await dutiesController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Missing 'name' in request body");
    });

    test("should return 404 if duty is not found updating a duty", async () => {
        mockDutiesService.update = jest.fn().mockResolvedValue(false);
        const req = { params: { id: "999" }, body: { name: "Nonexistent Duty" } } as unknown as Request;
        const res = { sendStatus: jest.fn() } as unknown as Response;
        await dutiesController.update(req, res);
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    test("should return 500 on error updating a duty", async () => {
        mockDutiesService.update = jest.fn().mockRejectedValue(new Error("Database failure"));
        const req = { params: { id: "1" }, body: { name: "Updated Duty" } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
        await dutiesController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error updating duty: Database failure");
    });

    test("should delete a duty", async () => {
        mockDutiesService.delete = jest.fn().mockResolvedValue(true);
        const req = { params: { id: "1" } } as unknown as Request;
        const res = { sendStatus: jest.fn() } as unknown as Response;
        await dutiesController.delete(req, res);
        expect(mockDutiesService.delete).toHaveBeenCalledWith("1");
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    test("should return 404 if duty is not found deleting a duty", async () => {
        mockDutiesService.delete = jest.fn().mockResolvedValue(false);
        const req = { params: { id: "999" } } as unknown as Request;
        const res = { sendStatus: jest.fn() } as unknown as Response;
        await dutiesController.delete(req, res);
        expect(mockDutiesService.delete).toHaveBeenCalledWith("999");
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    test("should return 500 on internal server error deleting a duty", async () => {
        mockDutiesService.delete = jest.fn().mockRejectedValue(new Error("Database failure"));
        const req = { params: { id: "1" } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
        await dutiesController.delete(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error deleting duty: Database failure");
    });

});
