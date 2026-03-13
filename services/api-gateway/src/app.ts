import express, { Express, Request, Response, NextFunction } from "express";
import httpProxy from "http-proxy";
import cors from "cors";
import { env } from "@e-commerce/common/src/env.ts"
import { gatewayLogger } from "@e-commerce/common/src/logger.ts"

const app: Express = express();
const port = env.API_GATEWAY_PORT;
const apiProxy = httpProxy.createProxyServer();

app.use(cors());

// /api/v1/orders
app.all("/orders/*", (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace('/orders', '/api/v1/orders');
    apiProxy.web(req, res, { target: `http://localhost:${env.ORDER_SERVICE_PORT}` }, (e) => {
        if (e) {
            gatewayLogger.error(e);
            next(e);
        }
    });
});

// /api/v1/users
app.all("/users/*", (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace('/users', '/api/v1/users');
    apiProxy.web(req, res, { target: `http://localhost:${env.USER_SERVICE_PORT}` }, (error: any) => {
        if (error) {
            gatewayLogger.error(error);
            next(error);
        }
    });
});

// /api/v1/auth
app.all("/auth/*", (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace('/auth', '/api/v1/auth');
    apiProxy.web(req, res, { target: `http://localhost:${env.USER_SERVICE_PORT}` }, (error: any) => {
        if (error) {
            gatewayLogger.error(error);
            next(error);
        }
    });
});

app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  gatewayLogger.error(err.stack); 
  res.status(500).send('Something broke!'); 
});

app.listen(port, () => {
    gatewayLogger.info(`API Gateway is running at http://localhost:${port}`);
});
