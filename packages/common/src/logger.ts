import pino from "pino"
import type { Logger } from "pino"

export const createLogger = (name: string): Logger => {
  return pino({
    name: name,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    },
    level: 'debug'
  })
}
