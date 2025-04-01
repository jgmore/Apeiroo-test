import { errorHandler } from "../middleware/errorHandler";
import { Request, Response, NextFunction } from "express";
import { DatabaseError, NotFoundError } from "../errors/customErrors";

describe("Error Handler Middleware", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {} as Request;
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    test("should handle generic errors", () => {
        const err = new Error("Test Error");
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });

    test("should handle NotFoundError", () => {
        const err = new NotFoundError("Not Found");
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Not Found" });
    });

    test("should handle DatabaseError", () => {
        const err = new DatabaseError("DB Connection Failed");
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error: DB Connection Failed" });
    });

    test("should handle validation errors", () => {
        const err = new Error("Invalid input");
        (err as any).name = "ValidationError"; // Simulating a validation error
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid input" });
    });
});
