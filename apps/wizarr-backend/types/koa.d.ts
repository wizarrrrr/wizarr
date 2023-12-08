import koa from "koa";
import type { Logger, LogFn, LoggerOptions } from "pino";
import type { Server } from "socket.io";

interface CustomLogger extends Logger {
    request: LogFn;
}

declare module "koa" {
    interface Context {
        io: Server;
        log: CustomLogger;
    }
    interface Request {
        log: CustomLogger;
    }
    interface Response {
        log: CustomLogger;
    }
}

declare module "http" {
    interface IncomingMessage {
        log: Logger<LoggerOptions>;
    }
}
