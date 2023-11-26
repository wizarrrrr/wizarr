import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

import morgan from "morgan";

@Service()
@Middleware({ type: "after" })
export class LoggingMiddleware implements KoaMiddlewareInterface {
    use(ctx: any, next: (err?: any) => Promise<any>): Promise<any> {
        const fn = morgan("dev");
        return new Promise((resolve, reject) => {
            fn(ctx.req, ctx.res, (err: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(next());
            });
        });
    }
}
