// Import required modules and types from various libraries
import { AppControllerRoute, AppViewRoute, BullBoardQueues, ControllerHandlerReturnType, IServerAdapter, UIConfig } from "@bull-board/api/dist/typings/app";
import Koa, { ParameterizedContext } from "koa";
import mount from "koa-mount";
import Router, { IRouterParamContext } from "koa-router";
import { bodyParser } from "@koa/bodyparser";
import serve from "koa-static";
import views from "@ladjs/koa-views";
import path from "path";
import { addRequestDataToEvent, captureException, withScope } from "@sentry/node";
import { authorizationCheck } from "src/middlewares/Authentication/AuthenticationCheck";

// Define the KoaAdapter class implementing the IServerAdapter interface
export class KoaAdapter implements IServerAdapter {
    // Define private properties for the adapter
    private basePath = "";
    private bullBoardQueues: BullBoardQueues | undefined;
    private errorHandler: ((error: Error) => ControllerHandlerReturnType) | undefined;
    private statics: { path: string; route: string } | undefined;
    private viewPath: string | undefined;
    private entryRoute: AppViewRoute | undefined;
    private apiRoutes: AppControllerRoute[] | undefined;
    private uiConfig: UIConfig = {};

    // Set the base path for the application
    public setBasePath(path: string): KoaAdapter {
        this.basePath = path;
        return this;
    }

    // Set the static files path and route
    public setStaticPath(staticsRoute: string, staticsPath: string): KoaAdapter {
        this.statics = { route: staticsRoute, path: staticsPath };
        return this;
    }

    // Set the views path for rendering templates
    public setViewsPath(viewPath: string): KoaAdapter {
        this.viewPath = viewPath;
        return this;
    }

    // Set a custom error handler for the application
    public setErrorHandler(handler: (error: Error) => ControllerHandlerReturnType) {
        this.errorHandler = handler;
        return this;
    }

    // Set API routes to handle backend logic
    public setApiRoutes(routes: AppControllerRoute[]): KoaAdapter {
        this.apiRoutes = routes;
        return this;
    }

    // Set the entry route for the application
    public setEntryRoute(routeDef: AppViewRoute): KoaAdapter {
        this.entryRoute = routeDef;
        return this;
    }

    // Set queues for Bull Board
    public setQueues(bullBoardQueues: BullBoardQueues): KoaAdapter {
        this.bullBoardQueues = bullBoardQueues;
        return this;
    }

    // Configure UI settings
    public setUIConfig(config: UIConfig = {}): KoaAdapter {
        this.uiConfig = config;
        return this;
    }

    // Register the plugin to initialize and mount the application
    public registerPlugin(options: Partial<{ mount: string }> = { mount: this.basePath }) {
        // Validate that all required properties are set before registering
        if (!this.statics) {
            throw new Error(`Please call 'setStaticPath' before using 'registerPlugin'`);
        } else if (!this.entryRoute) {
            throw new Error(`Please call 'setEntryRoute' before using 'registerPlugin'`);
        } else if (!this.viewPath) {
            throw new Error(`Please call 'setViewsPath' before using 'registerPlugin'`);
        } else if (!this.apiRoutes) {
            throw new Error(`Please call 'setApiRoutes' before using 'registerPlugin'`);
        } else if (!this.bullBoardQueues) {
            throw new Error(`Please call 'setQueues' before using 'registerPlugin'`);
        } else if (!this.errorHandler) {
            throw new Error(`Please call 'setErrorHandler' before using 'registerPlugin'`);
        }

        // Initialize the Koa application and router
        const app = new Koa();
        const router = new Router({ strict: true });

        // Add middleware for parsing request bodies
        app.use(bodyParser());

        // Add Sentry tracing middlewares
        app.on("error", (err, ctx) => {
            withScope((scope) => {
                scope.addEventProcessor((event) => {
                    return addRequestDataToEvent(event, ctx.request);
                });
                captureException(err);
            });
        });

        app.use(
            views(this.viewPath, {
                extension: path
                    .extname(
                        this.entryRoute.handler({
                            basePath: "/admin/bull",
                            uiConfig: this.uiConfig,
                        }).name,
                    )
                    .substring(1),
            }),
        );

        const { method, route, handler } = this.entryRoute;
        const viewRoutes = Array.isArray(route) ? route : [route];
        viewRoutes.forEach((path) => {
            if (path == "/") path = "";
            router[method]("/admin/bull" + path, async (ctx) => {
                try {
                    const isAuthorized = await authorizationCheck(ctx, ["admin"]);
                    if (!isAuthorized) {
                        ctx.redirect("/login");
                        return;
                    }
                    const { name, params } = handler({ basePath: "/admin/bull", uiConfig: this.uiConfig });
                    await (ctx as any).render(name, params);
                } catch (error) {
                    console.error("Authorization check failed:", error);
                    ctx.redirect("/login");
                }
            });
        });

        app.use(mount("/admin/bull/static", serve(this.statics.path)));

        // Register API routes for backend functionality
        this.apiRoutes.forEach((route) => {
            const methods = Array.isArray(route.method) ? route.method : [route.method];
            methods.forEach((method) => {
                const handler = async (ctx: ParameterizedContext<any, IRouterParamContext<any, {}>>) => {
                    if (await authorizationCheck(ctx, ["admin"])) {
                        const response = await route.handler({
                            queues: this.bullBoardQueues as any,
                            params: ctx.params,
                            query: ctx.query,
                            body: ctx.request.body,
                        });
                        ctx.status = response.status || 200;
                        return (ctx.body = response.body);
                    }
                };
                router[method](route.route, async (ctx) => handler(ctx));
                router[method]("/admin/bull" + route.route, async (ctx) => handler(ctx));
            });
        });

        // Use the configured router with the application
        app.use(router.routes()).use(router.allowedMethods());

        // Mount the application at the specified base path
        return mount("/", app);
    }
}
