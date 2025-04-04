import { Request, Response, NextFunction } from "express";
import {DatabaseError, NotFoundError, WrongVersionError} from "../errors/customErrors";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("Error on request: "+err.stack);

    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    if (err instanceof DatabaseError) {
        return res.status(500).json({ error: "Database error: " + err.message });
    }

    if (err instanceof WrongVersionError) {
        return res.status(404).json({ error: "Wrong version error: " + err.message });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
}
