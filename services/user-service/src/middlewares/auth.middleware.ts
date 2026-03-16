import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.ts";
import { env } from "@e-commerce/common/src/env.ts";

interface JwtPayload {
  uuid: string;
  role: string;
}

export interface AuthUser {
  uuid: string;
  role: string;
  password?: string;
}

// extende Request para receber req.user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// checa autenticação JWT
export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // First, check if this request came from the API Gateway
  // The gateway validates JWT and injects headers
  const userUuidFromGateway = req.headers["x-user-uuid"] as string;

  if (userUuidFromGateway) {
    // Trust the gateway's validation and fetch the full user
    const foundUser = await User.findByPk(userUuidFromGateway);

    if (!foundUser) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    req.user = foundUser;
    return next();
  }

  // Fallback: Validate JWT directly (for direct requests bypassing the gateway)
  const authHeader = req.headers.authorization || req.headers["Authorization"];

  // no bearer no auth!
  if (!authHeader?.toString().startsWith("Bearer ")) {
    res.status(401).json({ message: "Token is required for authentication" });
    return;
  }

  const token = authHeader.toString().split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token not found" });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_KEY as string) as unknown as JwtPayload;
    const foundUser = await User.findByPk(decoded.uuid);

    if (!foundUser) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    req.user = foundUser;
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  next();
};

// checa autorização User | Admin
export const authorized = (allowedRoles: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || req.user.role !== allowedRoles) {
      res.status(403).json({
        message: "You are not authorized to perform this action",
      });
      return;
    }

    next();
  };
};