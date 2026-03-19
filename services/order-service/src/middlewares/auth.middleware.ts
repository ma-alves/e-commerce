import type { Request, Response, NextFunction } from "express";

export interface AuthUser {
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

export const authorized = (allowedRoles: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== allowedRoles) {
      res.status(403).json({
        message: "You are not authorized to perform this action",
      });
      return;
    }
    next();
  };
};
