import { z } from "zod";
import type { createUserSchema, loginUserSchema, updateUserSchema } from "./schemas.ts";

export interface UserInterface {
  uuid: string;
  name: string;
  email: string;
  password: string;
  role: "User" | "Admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;