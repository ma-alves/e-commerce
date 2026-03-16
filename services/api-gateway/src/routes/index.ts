import { Router } from "express";
import httpProxy from "http-proxy";
import { gatewayLogger } from "@e-commerce/common/src/logger.ts";

export const router = Router();
export const apiProxy = httpProxy.createProxyServer();

// error handler do proxy
export const proxyErrorHandler = (error: Error) => {
  if (error) {
    gatewayLogger.error(`Proxy error: ${error.message}`);
  }
};