import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { env } from "@e-commerce/common/src/env.ts";
import { gatewayLogger } from "@e-commerce/common/src/logger.ts";

interface JwtPayload {
  uuid: string;
  role: string;
}

interface AuthUser {
  uuid: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// valida jwt
export const authenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization || req.headers["Authorization"];

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
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET_KEY as string
    ) as unknown as JwtPayload;

    // coloca uuid e role no header
    req.user = { uuid: decoded.uuid, role: decoded.role };
    
    // headers para serviços identificarem o usuário
    req.headers["x-user-uuid"] = decoded.uuid;
    req.headers["x-user-role"] = decoded.role;

    next();
  } catch (error) {
    gatewayLogger.error(`JWT verification failed: ${error}`);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// checa autorizações com base no role do usuário
export const authorized = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "You are not authorized to perform this action",
      });
      return;
    }

    next();
  };
};