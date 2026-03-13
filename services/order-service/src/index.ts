import express from "express";
import type { Request, Response } from "express";
import helmet from "helmet";
import orderRouter from "./routes/order.route.ts";
import { connectDB, syncDatabase } from "@e-commerce/common/src/db.ts";
import { orderLogger } from "@e-commerce/common/src/logger.ts"
import { env } from "@e-commerce/common/src/env.ts"

const app = express();
const port = env.ORDER_SERVICE_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false }));

app.use("/api/v1/orders", orderRouter);

app.get("/api/v1", (req: Request, res: Response) => {
  res.json({ message: "welcome to the order-service!" });
});

await connectDB();
await syncDatabase();

app.listen(port, async () => {
  orderLogger.info(`The order-service is running at http://localhost:${port}`);
});
