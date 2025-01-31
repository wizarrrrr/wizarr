import type { ConsolaInstance } from "consola";
import type { ServerResponse, IncomingMessage } from "http";
import type { Middleware, Context, Next } from "koa";
import { pino, type TransportTargetOptions } from "pino";
import type { HttpLogger, Options } from "pino-http";
import type { PrettyOptions } from "pino-pretty";
import type Container from "typedi";

export default (consola: ConsolaInstance, pinoOptions: Options & { transport: { targets: (TransportTargetOptions | { options: { prettyOptions: PrettyOptions } })[] } }, container: typeof Container): Middleware => {
    return (ctx: Context, next: Next) => {
        ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;
        container.set("Logger", ctx.log);
        try {
            return next();
        } catch (error) {
            consola.error(error);
        }
    };
};
