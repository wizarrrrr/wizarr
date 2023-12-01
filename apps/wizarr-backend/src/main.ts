import "reflect-metadata";

import { registerModuleAlias } from "./utils/modules.helper";

registerModuleAlias(__dirname);

import { getMetadataArgsStorage, RoutingControllersOptions, useContainer as useContainerRC, useKoaServer } from "routing-controllers";
import { SocketControllers } from "socket-controllers";
import { Container } from "typedi";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { swaggerConfig } from "./config/swagger";
import { koaSwagger } from "koa2-swagger-ui";
import { connection } from "./data-source";
import { Table } from "console-table-printer";
import { getCurrentVersion, isBeta } from "./utils/versions.helper";
import { authorizationCheck } from "./middlewares/Authentication/AuthenticationCheck";
import { currentUser } from "./middlewares/Authentication/CurrentUser";
import { SchemaObject } from "openapi3-ts";
import { init as useSentry, autoDiscoverNodePerformanceMonitoringIntegrations, withScope, captureException } from "@sentry/node";
import { addRequestDataToEvent } from "@sentry/utils";
import { Server as server, createServer } from "http";
import { Server as socketIO, ServerOptions } from "socket.io";
import { CorsOptions } from "cors";
import { databasePath } from "./config/paths";
import { PrettyOptions } from "pino-pretty";
import { TransportTargetOptions } from "pino";
import { pino } from "./utils/logger.helper";

import koa from "koa";
import path from "path";
import colors from "colors";
import cors from "@koa/cors";
import pinoHttp, { Options } from "pino-http";

export class App {
    // Define the Koa app and port
    private app: koa = new koa();
    private httpServer: server = createServer(this.app.callback());
    private port: number = 5001;

    // Define the server options for Koa
    private serverOptions: typeof koa.arguments = {
        // Default options
    };

    // Define the logger options for the application
    private loggerOptions: Options & { transport: { targets: (TransportTargetOptions | { options: { prettyOptions: PrettyOptions } })[] } } = {
        timestamp: () => `,"time":"${new Date().toLocaleTimeString()}"`,
        transport: {
            targets: [
                {
                    level: "warn",
                    target: "pino/file",
                    options: {
                        destination: path.join(databasePath, "/logs/warn.log"),
                        mkdir: true,
                    },
                },
                {
                    level: "info",
                    target: "@wizarrrr/pino-http-logger",
                    options: {
                        all: true,
                        prettyOptions: {
                            hideObject: true,
                            ignore: "pid,hostname",
                        },
                    },
                },
            ],
        },
    };

    // Define the cors options for the application
    private corsOptions: cors.Options & CorsOptions = {
        // Default options
        origin: "*",
    };

    // Define the routing controller options
    private routingControllerOptions: RoutingControllersOptions = {
        validation: { stopAtFirstError: true },
        authorizationChecker: authorizationCheck,
        currentUserChecker: currentUser,
        cors: true,
        routePrefix: "/api",
        classTransformer: true,
        defaultErrorHandler: false,
        controllers: [path.join(__dirname, "/api/controllers/**/*.{js,ts}")],
        middlewares: [path.join(__dirname, "/middlewares/**/*.{js,ts}")],
    };

    // Define the socket.io options
    private socketIOOptions: Partial<ServerOptions> = {
        // Default options
        cors: this.corsOptions,
    };

    // Define the logger for the application
    private logger = pinoHttp(this.loggerOptions);
    public log = this.logger.logger;

    /**
     * Constructor
     * @param options The options for the server
     */
    constructor(options?: typeof koa.arguments) {
        // Merge the default options with the options passed in
        this.serverOptions = { ...this.serverOptions, ...options };
    }

    /**
     * Initialize the server
     */
    public async initialize() {
        // Initialize the server dependencies
        this.addProcessListeners();
        this.setupSentry();
        this.registerMiddlewares();
        this.useContainers();
        await this.createTypeORMConnection();
        this.registerSocketControllers();
        this.registerRoutingController();
        this.setupSwagger();

        // Start the server
        this.httpServer.listen(this.port, async () => {
            // Create the server table
            const table = await this.createServerTable();

            // Print the server table
            table.printTable();
        });
    }

    /**
     * Create a table for server information
     */
    private async createServerTable() {
        return new Table({
            title: colors.blue("Server Information"),
            columns: [
                { name: "1", title: colors.strip(colors.white("Address")), alignment: "left" },
                { name: "2", title: colors.green(`http://localhost:${this.port}`), alignment: "left" },
            ],
            rows: [
                { 1: colors.bold("Version"), 2: (await isBeta()) ? colors.yellow(await getCurrentVersion()) : colors.green(await getCurrentVersion()) },
                { 1: colors.bold("Channel"), 2: (await isBeta()) ? colors.yellow("Beta") : colors.green("Stable") },
                { 1: colors.bold("Description"), 2: colors.blue("Wizarr is a media server mangement system") },
            ],
        });
    }

    /**
     * Use containers for application
     */
    private useContainers() {
        useContainerRC(Container);
    }

    /**
     * Create the TypeORM connection
     */
    private async createTypeORMConnection() {
        await connection.initialize().catch((err) => {
            this.log.error(err, "Failed to connect to database");
            process.exit(1);
        });
    }

    /**
     * Register the routing controller
     */
    private registerRoutingController() {
        useKoaServer(this.app, this.routingControllerOptions);
    }

    /**
     * Register the middlewares
     */
    private registerMiddlewares() {
        this.app.use(pino(this.logger));
        this.app.use(cors(this.corsOptions));
    }

    /**
     * Register the socket.io server
     */
    private registerSocketControllers() {
        const io = new socketIO(this.httpServer, this.socketIOOptions);

        this.app.use(async (ctx, next) => {
            ctx.io = io;
            await next();
        });

        return new SocketControllers({
            io: io,
            container: Container,
            controllers: this.routingControllerOptions.controllers,
            middlewares: this.routingControllerOptions.middlewares,
        });
    }

    /**
     * Setup Swagger for the server
     */
    private async setupSwagger() {
        // Route Prefix
        const routePrefix = this.routingControllerOptions.routePrefix;

        // Parse class-validator classes into JSON Schema
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: "#/components/schemas/",
        });

        // Parse routing-controllers classes into OpenAPI spec:
        const storage = getMetadataArgsStorage();
        const config = await swaggerConfig(schemas as SchemaObject);
        const spec = routingControllersToSpec(storage, { routePrefix }, config as any);

        // Render spec on route
        this.app.use((ctx, next) => {
            if (ctx.request.path === `${routePrefix}/openapi.json`) {
                ctx.body = spec;
            }
            return next();
        });

        // Render swagger on route
        this.app.use(koaSwagger({ routePrefix: `${routePrefix}/docs`, swaggerOptions: { spec } }));
    }

    /**
     * Setup Sentry Reporting for the server
     */
    private async setupSentry() {
        // Initialize Sentry for error reporting
        useSentry({
            dsn: "https://2213de43d3adb70847691c680ea2e0de@sentry.wizarr.dev/5",
            tracesSampleRate: 1.0,
            integrations: [
                // Automatically instrument Node.js libraries and frameworks
                ...autoDiscoverNodePerformanceMonitoringIntegrations(),
            ],
            environment: process.env.NODE_ENV,
        });

        // Add Sentry tracing middlewares
        this.app.on("error", (err, ctx) => {
            withScope((scope) => {
                scope.addEventProcessor((event) => {
                    return addRequestDataToEvent(event, ctx.request);
                });
                captureException(err);
            });
        });
    }

    /**
     * Shutdown object information data
     */
    private shutdownObjectInfo(type: string) {
        return {
            shutdownType: type,
            shutdownTime: new Date(),
        };
    }

    /**
     * Add process listeners for graceful control of the server
     */
    private addProcessListeners() {
        // Handle process exit
        process.on("exit", async () => {
            this.httpServer.close();
        });

        // Handle process termination
        process.on("SIGTERM", async () => {
            this.log.warn(this.shutdownObjectInfo("SIGTERM"), "SIGTERM signal received.");
            this.httpServer.close();
            process.exit(0);
        });

        // Handle process interruption
        process.on("SIGINT", async () => {
            this.log.warn(this.shutdownObjectInfo("SIGINT"), "SIGINT signal received.");
            this.httpServer.close();
            process.exit(0);
        });
    }
}

const app = new App();
app.initialize();

export default app;
