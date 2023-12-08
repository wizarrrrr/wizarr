import type { ServerResponse, IncomingMessage } from "http";
import type { Middleware as BaseMiddleware, Context, Next } from "koa";
import type { Logger } from "pino";
import type { HttpLogger, Options } from "pino-http";

import PrettyError from "pretty-error";
import Container from "typedi";

const pe = new PrettyError();

interface Middleware extends Partial<BaseMiddleware> {
    logger: Logger;
}

export function pino(wrap: HttpLogger<IncomingMessage, ServerResponse<IncomingMessage>, Options<IncomingMessage, ServerResponse<IncomingMessage>>>, container: typeof Container): Middleware | any {
    async function pino(ctx: Context, next: Next) {
        wrap(ctx.req, ctx.res);
        // @ts-ignore
        ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;
        try {
            return await next();
        } catch (error) {
            ctx.log.error(error);
            process.stderr.write(pe.render(error));
            throw error;
        }
    }

    container.set("Logger", wrap.logger);
    pino.logger = wrap.logger;
    return pino;
}
