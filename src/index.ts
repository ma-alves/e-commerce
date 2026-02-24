import express from "express";
import type { Request, Response } from "express";
import userRouter from "./users/user.routes.ts";
import { connectDB, syncDatabase } from "./config/db.ts";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRouter);
app.use("/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

await connectDB();
await syncDatabase();

app.listen(port, async () => {
  console.log(`The server is running at http://localhost:${port}`);
});
