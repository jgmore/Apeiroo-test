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

//CORS Section
let allowedOrigins : string | undefined = process.env.FRONTEND_URL;
if (!allowedOrigins) {
  console.log("No frontend URL defined, using default value");
  allowedOrigins = 'http://localhost:3000';
}
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());


app.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/duties', createDutiesRouter(dutiesService));

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  errorHandler(err, req, res, next);
});

export { app, PORT };
/*
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;*/