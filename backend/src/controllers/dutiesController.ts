import { Request, Response, NextFunction } from "express";
import { DutiesService } from "../services/dutiesService";

export class DutiesController {
    private dutiesService: DutiesService;

    constructor(dutiesService: DutiesService) {
        this.dutiesService = dutiesService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const duties = await this.dutiesService.getAll();
            res.status(200).json(duties);
        } catch (err: unknown) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body as { name?: string };
            if (!name) {
                res.status(400).send("Missing 'name' in request body");
                return;
            }
            const duty = await this.dutiesService.create(name);
            res.status(201).json(duty);
        } catch (err: unknown) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name } = req.body as { name?: string };
            const { version } = req.body as { version?: string };
            const parsedVersion = version ? new Date(version) : undefined;
            if (parsedVersion && isNaN(parsedVersion.getTime())) {
                throw new Error(`Invalid date format for version: ${version}`);
            }

            if (!name) {
                res.status(400).send("Missing 'name' in request body");
                return;
            }
            if (!parsedVersion) {
                res.status(400).send("Missing 'version' in request body");
                return;
            }
            const success = await this.dutiesService.update(id, name, parsedVersion);
            success ? res.sendStatus(200) : res.sendStatus(404);
        } catch (err: unknown) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { version } = req.body as { version?: string };
            const parsedVersion = version ? new Date(version) : undefined;
            if (parsedVersion && isNaN(parsedVersion.getTime())) {
                throw new Error(`Invalid date format for version: ${version}`);
            }
            if (!parsedVersion) {
                res.status(400).send("Missing 'version' in request body");
                return;
            }
            const success = await this.dutiesService.delete(id,parsedVersion);
            success ? res.sendStatus(200) : res.sendStatus(404);
        } catch (err: unknown) {
            next(err);
        }
    }
}
