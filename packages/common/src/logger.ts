import pino from "pino";
import type { Logger } from "pino";

// considerar usar pretty-pino
const logger: Logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },
  level: 'debug'
})

export const userLogger = logger.child({ module: 'user-service' })