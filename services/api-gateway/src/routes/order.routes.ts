import { Request, Response, NextFunction } from "express";
import { env } from "@e-commerce/common/src/env.ts";
import { authenticated } from "../middlewares/auth.middleware.ts";
import { router, apiProxy, proxyErrorHandler } from "./index.ts";

// Orders routes - require authentication
router.get(
  "/orders*",
  authenticated,
  (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace("/orders", "/api/v1/orders");
    apiProxy.web(
      req,
      res,
      { target: `http://localhost:${env.ORDER_SERVICE_PORT}` },
      proxyErrorHandler
    );
  }
);

router.post(
  "/orders*",
  authenticated,
  (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace("/orders", "/api/v1/orders");
    apiProxy.web(
      req,
      res,
      { target: `http://localhost:${env.ORDER_SERVICE_PORT}` },
      proxyErrorHandler
    );
  }
);

router.put(
  "/orders*",
  authenticated,
  (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace("/orders", "/api/v1/orders");
    apiProxy.web(
      req,
      res,
      { target: `http://localhost:${env.ORDER_SERVICE_PORT}` },
      proxyErrorHandler
    );
  }
);

export default router;