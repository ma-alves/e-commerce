import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.ts";

interface JwtPayload {
  uuid: string;
  role: string;
}

// extende Request para receber req.user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// checa autenticação JWT
export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization || req.headers["Authorization"];

  // no bearer no auth!
  if (!authHeader?.toString().startsWith("Bearer ")) {
    res.status(401).json({ message: "Token is required for authentication" });
    return;
  }

  const token = authHeader.toString().split(" ")[1];

  if (!token) throw new Error("Token not found")

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as unknown as JwtPayload;

    const foundUser = await User.findByPk(decoded.uuid);

    if (!foundUser) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = foundUser;
  } catch {
    res.status(401).json({ message: "Invalid authentication token" });
    return;
  }

  next();
};

// checa autorização User | Admin
export const authorized = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({
        message: "You are not authorized to perform this action",
      });
      return;
    }

    next();
  };
};