import { Router } from "express";
import { authenticated, authorized } from "./middlewares/auth.middleware.ts";
import { validateData } from "./middlewares/validation.middleware.ts";
import { createUserSchema, loginUserSchema, updateUserSchema } from "./schemas.ts";
import {
  // createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "./user.controllers.ts";
import { 
  loginController,
  registerController,
  refreshToken,
  me 
} from "./auth.controller.ts";

const userRouter = Router();

// Rota pública
userRouter.post("/login", validateData(loginUserSchema), loginController);
userRouter.post("/register", registerController);
userRouter.post("/", validateData(createUserSchema), registerController);

// Rota protegida — qualquer usuário autenticado
userRouter.post("/refresh", authenticated, refreshToken);
userRouter.get("/me", authenticated, me);
userRouter.get("/", authenticated, authorized("Admin"), getUsersController);
userRouter.get("/:uuid", authenticated, getUserByIdController);
userRouter.put("/:uuid/update", authenticated, validateData(updateUserSchema), updateUserController);
userRouter.delete("/:uuid/delete", authenticated, authorized("Admin"), deleteUserController);

export default userRouter