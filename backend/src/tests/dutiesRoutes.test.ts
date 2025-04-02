import { createDutiesRouter } from "../routes/dutiesRoutes";
import { Router } from "express";
import { DutiesService } from "../services/dutiesService";
import { DutiesController } from "../controllers/dutiesController";
import request from "supertest";
import express from "express";

jest.mock("../services/dutiesService");
jest.mock("../controllers/dutiesController", () => {
    return {
        DutiesController: jest.fn().mockImplementation(() => ({
            getAll: jest.fn((req, res) => res.status(200).send("getAll")),
            create: jest.fn((req, res) => res.status(201).send("create")),
            update: jest.fn((req, res) => res.status(200).send("update")),
            delete: jest.fn((req, res) => res.status(200).send("delete")),
        })),
    };
});

describe("Duties Routes", () => {
    let dutiesService: DutiesService;
    let router: Router;
    let app: express.Express;

    beforeEach(() => {
        dutiesService = new DutiesService();
        router = createDutiesRouter(dutiesService);
        app = express();
        app.use(express.json());
        app.use("/duties", router);
    });

    test("should create the router", () => {
        expect(router).toBeDefined();
    });

    test("GET /duties should call getAll", async () => {
        const response = await request(app).get("/duties");
        expect(response.status).toBe(200);
        expect(response.text).toBe("getAll");
    });

    test("POST /duties should call create", async () => {
        const response = await request(app).post("/duties").send({ name: "New Duty" });
        expect(response.status).toBe(201);
        expect(response.text).toBe("create");
    });

    test("PUT /duties/:id should call update", async () => {
        const response = await request(app).put("/duties/1").send({ name: "Updated Duty" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("update");
    });

    test("DELETE /duties/:id should call delete", async () => {
        const response = await request(app).delete("/duties/1");
        expect(response.status).toBe(200);
        expect(response.text).toBe("delete");
    });
});
