import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { env } from "@e-commerce/common/src/env.ts";

interface JwtPayload {
  uuid: string;
  role: string;
}

interface AuthUser {
  uuid: string;
  role: string;
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
  const authHeader = req.headers.authorization || req.headers["Authorization"];

  // no bearer no auth!
  if (!authHeader?.toString().startsWith("Bearer ")) {
    res.status(401).json({ message: "Token is required for authentication" });
    return;
  }

  const token = authHeader.toString().split(" ")[1];

  if (!token) throw new Error("Token not found")

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_KEY as string) as unknown as JwtPayload;

    // Armazenaremos o uuid e role do usuário autenticado
    // Se precisar dos dados completos do user, fazer uma chamada ao user-service
    req.user = { uuid: decoded.uuid, role: decoded.role };
  } catch (error) {
    res.status(401).json({ message: `${error}` });
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
