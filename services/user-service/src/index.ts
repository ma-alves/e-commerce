import express from "express";
import type { Request, Response } from "express";
import helmet from "helmet";
import userRouter from "./routes/user.route.ts";
import authRouter from "./routes/auth.route.ts";
import { connectDB, syncDatabase } from "./config/db.ts";
import { userLogger } from "@e-commerce/common/src/logger.ts"
import { env } from "@e-commerce/common/src/env.ts"

// adicionar cors e !rate-limiter

const app = express();
const port = env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false })); // impede aquele Cannot GET

app.use("api/v1/auth", authRouter);
app.use("api/v1/users", userRouter);

app.get("api/v1", (req: Request, res: Response) => {
  res.json({ message: "welcome to the e-commerce server!" });
});

await connectDB();
await syncDatabase();

app.listen(port, async () => {
  userLogger.info(`The server is running at http://localhost:${port}`);
});
