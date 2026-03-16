import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
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
  const userRoleFromGateway = req.headers["x-user-role"] as string;

  if (userUuidFromGateway && userRoleFromGateway) {
    // Trust the gateway's validation
    req.user = {
      uuid: userUuidFromGateway,
      role: userRoleFromGateway,
    };
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

    // Armazenaremos o uuid e role do usuário autenticado
    // Se precisar dos dados completos do user, fazer uma chamada ao user-service
    req.user = { uuid: decoded.uuid, role: decoded.role };
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
