import koa from "koa";
import type { Logger, LogFn } from "pino";

interface CustomLogger extends Logger {
    request: LogFn;
}

declare module "koa" {
    interface Context {
        io: sockerIO;
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
        log: CustomLogger;
    }
}
