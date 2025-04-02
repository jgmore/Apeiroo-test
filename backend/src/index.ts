import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createDutiesRouter } from './routes/dutiesRoutes';
import { DutiesService } from './services/dutiesService';
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";

dotenv.config({ path: "./src/.env" });

const dutiesService = new DutiesService();

const app = express();
let parsedPort = Number(process.env.HOST_PORT);
if (isNaN(parsedPort) || parsedPort <= 0) {
  console.log("Invalid port number "+process.env.HOST_PORT+", using default port 3001");
  parsedPort=3001;
}

const PORT: number = parsedPort;


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

