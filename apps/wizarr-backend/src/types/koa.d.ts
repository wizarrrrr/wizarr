import koa from "koa";
import type { Logger, LogFn, LoggerOptions } from "pino";
import type { Server } from "socket.io";

declare module "koa" {
    interface Context {
        io: Server;
        log: Logger<LoggerOptions>;
    }
    interface Request {
        log: Logger<LoggerOptions>;
    }
    interface Response {
        log: Logger<LoggerOptions>;
    }
}

declare module "http" {
    interface IncomingMessage {
        log: Logger<LoggerOptions>;
    }
}
