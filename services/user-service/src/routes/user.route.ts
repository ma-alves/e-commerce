import { Router } from "express";
import { authorized } from "../middlewares/auth.middleware.ts";
import { validateData } from "../middlewares/validation.middleware.ts";
import { updateUserSchema } from "../validation/schemas.ts";
import {
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controllers.ts";

const userRouter = Router();

userRouter.get("/", authorized("Admin"), getUsersController);
userRouter.get("/:uuid", getUserByIdController);
userRouter.put("/:uuid/update", validateData(updateUserSchema), updateUserController);
userRouter.delete("/:uuid/delete", authorized("Admin"), deleteUserController);

export default userRouter
