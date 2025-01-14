import { KoaMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { Context } from "koa";
import { extractTraceparentData, stripUrlQueryAndFragment } from "@sentry/utils";
import { getCurrentHub, startTransaction } from "@sentry/node";

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
        const transaction = startTransaction({
            name: `${reqMethod} ${reqUrl}`,
            op: "http.server",
            ...traceparentData,
        });

        // Add transaction to the context
        context.__sentry_transaction = transaction;

        // We put the transaction on the scope so users can attach children to it
        getCurrentHub().configureScope((scope) => {
            scope.setSpan(transaction);
        });

        // Add transaction end handler to the request on finish hook
        context.res.on("finish", () => {
            setImmediate(() => {
                // Just in case we are using koa router, we set the matched route as transaction name
                if (context._matchedRoute) {
                    const mountPath = context.mountPath || "";
                    transaction.setName(`${reqMethod} ${mountPath}${context._matchedRoute}`);
                }
                transaction.setHttpStatus(context.status);
                transaction.finish();
            });
        });

        await next();
    }
}
