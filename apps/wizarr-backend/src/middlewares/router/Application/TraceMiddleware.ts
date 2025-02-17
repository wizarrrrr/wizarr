import { KoaMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { Context } from "koa";
import { extractTraceparentData, stripUrlQueryAndFragment } from "@sentry/utils";
import { startSpan } from "@sentry/node";

@Service()
@Middleware({ type: "before" })
export class TraceMiddleware implements KoaMiddlewareInterface {
    /**
     * Handler that catches all errors and returns a JSON response
     * @param context
     * @param next
     * @returns
     */
    public async use(context: Context, next: (err?: any) => Promise<any>): Promise<any> {
        const reqMethod = (context.method || "").toUpperCase();
        const reqUrl = context.url && stripUrlQueryAndFragment(context.url);

        // Connect to trace of upstream app if it exists
        let traceparentData;
        if (context.request.get("sentry-trace")) {
            traceparentData = extractTraceparentData(context.request.get("sentry-trace"));
        }

        // Start a transaction with Sentry and attach to the request
        startSpan({ name: `${reqMethod} ${reqUrl}`, op: "http.server", ...traceparentData }, (transaction) => {
            context.__sentry_transaction = transaction;
        });

        // Add transaction end handler to the request on finish hook
        context.res.on("finish", () => {
            setImmediate(() => {
                // Just in case we are using koa router, we set the matched route as transaction name
                if (context._matchedRoute) {
                    const mountPath = context.mountPath || "";
                    context.__sentry_transaction.setName(`${reqMethod} ${mountPath}${context._matchedRoute}`);
                }
                context.__sentry_transaction.setHttpStatus(context.status);
                context.__sentry_transaction.finish();
            });
        });

        await next();
    }
}
