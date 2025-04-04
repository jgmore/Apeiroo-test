import { DutiesController } from "../controllers/dutiesController";
import { DutiesService } from "../services/dutiesService";
import { Request, Response } from "express";
import {errorHandler} from "../middleware/errorHandler";

describe("Duties Controller", () => {
    let dutiesController: DutiesController;
    let mockDutiesService: Partial<DutiesService>;
    const mockDate = new Date();
    const next = jest.fn();

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
        await dutiesController.getAll(req, res, next);
        expect(mockDutiesService.getAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: "1", name: "Test Duty" }]);
    });

    test("should create a duty", async () => {
        const req = { body: { name: "New Duty" } } as Request;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
        await dutiesController.create(req, res, next);
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
        await dutiesController.create(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Missing 'name' in request body");
    });

    test("should call next with an error when creating a duty fails", async () => {
        const error = new Error("Database failure");
        mockDutiesService.create = jest.fn().mockRejectedValue(error);
        const req = { body: { name: "New Duty" } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        const next = jest.fn();
        await dutiesController.create(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test("should return 500 and database error message from middleware", () => {
        const err = new Error("Database failure");
        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        const next = jest.fn();
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });



    test("should update a duty", async () => {
        const req = { params: { id: "1" }, body: { name: "Updated Duty", version: mockDate } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            sendStatus: jest.fn()
        } as unknown as Response;
        await dutiesController.update(req, res, next);
        expect(mockDutiesService.update).toHaveBeenCalledWith("1", "Updated Duty", mockDate);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    test("should return 400 if name is missing updating a duty", async () => {
        const req = { params: { id: "1" }, body: {} } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;
        await dutiesController.update(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Missing 'name' in request body");
    });

    test("should return 400 if version is missing updating a duty", async () => {
        const req = { params: { id: "1" }, body: { name : "No version duty" } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;
        await dutiesController.update(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Missing 'version' in request body");
    });

    test("should return 404 if duty is not found updating a duty", async () => {
        mockDutiesService.update = jest.fn().mockResolvedValue(false);
        const req = { params: { id: "999" }, body: { name: "Nonexistent Duty", version: mockDate } } as unknown as Request;
        const res = { sendStatus: jest.fn() } as unknown as Response;
        await dutiesController.update(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    test("should call next with an error when updating a duty fails", async () => {
        const error = new Error("Database failure");
        mockDutiesService.update = jest.fn().mockRejectedValue(error);
        const req = {
            params: { id: "1" },
            body: { name: "Updated Duty", version: mockDate }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;
        const next = jest.fn();
        await dutiesController.update(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });


    test("should delete a duty", async () => {
        mockDutiesService.delete = jest.fn().mockResolvedValue(true);
        const req = { params: { id: "1" }, body: { version: mockDate } } as unknown as Request;
        const res = { sendStatus: jest.fn() } as unknown as Response;
        await dutiesController.delete(req, res, next);
        expect(mockDutiesService.delete).toHaveBeenCalledWith("1", mockDate);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    test("should return 404 if duty is not found deleting a duty", async () => {
        mockDutiesService.delete = jest.fn().mockResolvedValue(false);
        const req = { params: { id: "999" }, body: { version: mockDate } } as unknown as Request;
        const res = { sendStatus: jest.fn() } as unknown as Response;
        await dutiesController.delete(req, res, next);
        expect(mockDutiesService.delete).toHaveBeenCalledWith("999", mockDate);
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    test("should call next with an error when deleting a duty fails", async () => {
        const error = new Error("Database failure");
        mockDutiesService.delete = jest.fn().mockRejectedValue(error);
        const req = {
            params: { id: "1" },
            body: { version: mockDate }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;
        const next = jest.fn();
        await dutiesController.delete(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });


    test("should return 400 if version is missing deleting a duty", async () => {
        const req = { params: { id: "1" }, body: {  } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;
        await dutiesController.delete(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Missing 'version' in request body");
    });
});
