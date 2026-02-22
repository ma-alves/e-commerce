import { Router } from "express";
import { authenticated, authorized } from "./auth.middleware.js";
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "./user.controllers.js";

const userRouter = Router();

// Rota pública
userRouter.post("/login", loginController);
userRouter.post("/register", registerController);

// Rota protegida — qualquer usuário autenticado
userRouter.post("/", createUserController);
userRouter.get("/", authenticated, authorized("Admin"), getUsersController);
userRouter.get("/:uuid", authenticated, getUserByIdController);
userRouter.put("/:uuid", authenticated, updateUserController);
userRouter.delete("/:uuid", authenticated, authorized("Admin"), deleteUserController);

export default userRouter