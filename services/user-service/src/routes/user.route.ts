import { Router } from "express";
import { authenticated, authorized } from "../middlewares/auth.middleware.ts";
import { validateData } from "../middlewares/validation.middleware.ts";
import { updateUserSchema } from "../validation/schemas.ts";
import {
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controllers.ts";

const userRouter = Router();

userRouter.get("/", authenticated, authorized("Admin"), getUsersController);
userRouter.get("/:uuid", authenticated, getUserByIdController);
userRouter.put("/:uuid/update", authenticated, validateData(updateUserSchema), updateUserController);
userRouter.delete("/:uuid/delete", authenticated, authorized("Admin"), deleteUserController);

export default userRouter