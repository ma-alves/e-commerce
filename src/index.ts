import express from "express";
import type { Request, Response } from "express";
import userRouter from "./users/user.routes.js";

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
