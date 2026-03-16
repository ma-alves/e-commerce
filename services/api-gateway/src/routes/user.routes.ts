import { Request, Response, NextFunction } from "express";
import { env } from "@e-commerce/common/src/env.ts";
import { authenticated, authorized } from "../middlewares/auth.middleware.ts";
import { router, apiProxy, proxyErrorHandler } from "./index.ts";


router.post("/auth/login", (req: Request, res: Response, next: NextFunction) => {
  req.url = "/api/v1/auth/login";
  apiProxy.web(
    req,
    res,
    { target: `http://localhost:${env.USER_SERVICE_PORT}` },
    proxyErrorHandler
  );
});

router.post(
  "/auth/register",
  (req: Request, res: Response, next: NextFunction) => {
    req.url = "/api/v1/auth/register";
    apiProxy.web(
      req,
      res,
      { target: `http://localhost:${env.USER_SERVICE_PORT}` },
      proxyErrorHandler
    );
  }
);

router.get(
  "/users*",
  authenticated,
  (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace("/users", "/api/v1/users");
    apiProxy.web(
      req,
      res,
      { target: `http://localhost:${env.USER_SERVICE_PORT}` },
      proxyErrorHandler
    );
  }
);

router.put(
  "/users*",
  authenticated,
  (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace("/users", "/api/v1/users");
    apiProxy.web(
      req,
      res,
      { target: `http://localhost:${env.USER_SERVICE_PORT}` },
      proxyErrorHandler
    );
  }
);

router.delete(
  "/users*",
  authenticated,
  authorized(["Admin"]),
  (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace("/users", "/api/v1/users");
    apiProxy.web(
      req,
      res,
      { target: `http://localhost:${env.USER_SERVICE_PORT}` },
      proxyErrorHandler
    );
  }
);