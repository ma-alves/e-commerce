import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.ts";
import { env } from "@e-commerce/common/src/env.ts"

const secretKey = env.JWT_SECRET_KEY as string;

if (!env.JWT_SECRET_KEY) throw new Error("JWT_SECRET_KEY is not defined");

interface UserPayload {
  uuid: string | number;
  role: string;
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

async function generateToken(user: UserPayload): Promise<string> {
  const payload: UserPayload = { uuid: user.uuid, role: user.role };
  return jwt.sign(payload, secretKey, { expiresIn: "4h" });
}

async function authenticate(email: string, password: string): Promise<string> {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  return generateToken(user);
}

export { authenticate, generateToken, hashPassword, verifyPassword };