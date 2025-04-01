import { Request, Response } from "express";
import { DutiesService } from "../services/dutiesService";

export class DutiesController {
    private dutiesService: DutiesService;

    constructor(dutiesService: DutiesService) {
        this.dutiesService = dutiesService;
    }

    async getAll(req: Request, res: Response) {
        try {
            const duties = await this.dutiesService.getAll();
            res.status(200).json(duties);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            res.status(500).json({ error: "Failed to fetch duties: " + errorMsg });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name } = req.body as { name?: string };
            if (!name) {
                res.status(400).send("Missing 'name' in request body");
                return;
            }
            const duty = await this.dutiesService.create(name);
            res.status(201).json(duty);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            res.status(500).json({ error: "Error creating duty: " + errorMsg});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name } = req.body as { name?: string };
            if (!name) {
                res.status(400).send("Missing 'name' in request body");
                return;
            }
            const success = await this.dutiesService.update(id, name);
            success ? res.sendStatus(200) : res.sendStatus(404);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            res.status(500).send("Error updating duty: " + errorMsg);
        }
    }
}
