import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "@e-commerce/common/src/env.ts";
import { createLogger } from "@e-commerce/common/src/logger.ts";
import { router } from "./routes/index.ts";

const app: Express = express();
const port = env.API_GATEWAY_PORT;
const logger = createLogger("[api-gateway]");

app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use("/", router);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  logger.info(`API Gateway is running at http://localhost:${port}`);
});

export default app;