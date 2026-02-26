import express from "express";
import type { Request, Response } from "express";
import helmet from "helmet";
import userRouter from "./routes/user.route.ts";
import authRouter from "./routes/auth.route.ts";
import { connectDB, syncDatabase } from "./config/db.ts";

// adicionar cors e !rate-limiter

const app = express();
const port = process.env.PORT || 3000;

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
  console.log(`The server is running at http://localhost:${port}`);
});
