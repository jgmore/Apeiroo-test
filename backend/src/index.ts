import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { createDutiesRouter } from './routes/dutiesRoutes';
import { DutiesService } from './services/dutiesService';
import { errorHandler } from "./middleware/errorHandler";


const dutiesService = new DutiesService();

const app = express();
const PORT: number = 3001;

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  errorHandler(err, req, res, next);
});

// Routes
app.use('/duties', createDutiesRouter(dutiesService));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

