import { Router } from "express";
import { authenticated } from "../middlewares/auth.middleware.ts";
import { validateData } from "../middlewares/validation.middleware.ts";
import { createUserSchema, loginUserSchema } from "../validation/schemas.ts";
import { 
  loginController,
  registerController,
  refreshToken,
  me 
} from "../controllers/auth.controller.ts";

const authRouter = Router()

// funcionam!
authRouter.post("/login", validateData(loginUserSchema), loginController);
authRouter.post("/register", validateData(createUserSchema), registerController);
authRouter.post("/refresh", authenticated, refreshToken);
authRouter.get("/me", authenticated, me);

export default authRouter