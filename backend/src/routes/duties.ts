import express from 'express';
import { DutiesService } from '../services/dutiesService';

const router = express.Router();
const service = new DutiesService();

router.get('/', async (_, res) => {
  const duties = await service.getAll();
  res.json(duties);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const duty = await service.create(name);
  res.status(201).json(duty);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const success = await service.update(id, name);
  success ? res.sendStatus(200) : res.sendStatus(404);
});

export default router;