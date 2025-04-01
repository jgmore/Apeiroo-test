import { Router } from "express";
import { DutiesService } from '../services/dutiesService';
import { DutiesController } from "../controllers/dutiesController";

const router = Router();
const dutiesService = new DutiesService();
const controller = new DutiesController(dutiesService);

export function createDutiesRouter(dutiesService: DutiesService): Router {
  // GET /
  router.get("/", controller.getAll.bind(controller));

  // POST /
  router.post("/", controller.create.bind(controller));

  // PUT /:id
  router.put("/:id", controller.update.bind(controller));

  return router;
}
