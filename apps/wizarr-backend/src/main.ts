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
import { controllerAuthorizationCheck, koaAuthorizationCheck } from "./middlewares/Authentication/AuthenticationCheck";
import { currentUser } from "./middlewares/Authentication/CurrentUser";
import { SchemaObject } from "openapi3-ts";
import { init as useSentry, autoDiscoverNodePerformanceMonitoringIntegrations, withScope, captureException } from "@sentry/node";
import { addRequestDataToEvent } from "@sentry/utils";
import { Server as server, createServer } from "http";
import { Server as socketIO, ServerOptions } from "socket.io";
import { CorsOptions } from "cors";
import { databasePath } from "./config/paths";
import { PrettyOptions } from "pino-pretty";
import { Logger, TransportTargetOptions } from "pino";
import { pino } from "./utils/logger.helper";
import { KoaAdapter } from "./bull/koaAdapter";
import { createBullBoard } from "@bull-board/api";
import { Queue, Worker } from "bullmq";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Server } from "./api/models/Server/ServerModel";
import { BullMQ } from "./bull/index";
import { createKeyPair, existsKeyPair } from "./utils/secret.helper";
import { scanLibrariesJobs, scanUsersJobs } from "./media/jobs";
import { writeFileSync } from "fs";
import { BoardOptions } from "@bull-board/api/dist/typings/app";

import Koa from "koa";
import Router from "koa-router";
import path from "path";
import colors from "colors";
import cors from "@koa/cors";
import pinoHttp, { Options } from "pino-http";

export class App {
    // Define the Koa app and port
    private app: Koa = new Koa();
    private router = new Router({ strict: true });
    private httpServer: server = createServer(this.app.callback());
    private port: number = 5001;

    // Define the server options for Koa
    private serverOptions: typeof Koa.arguments = {
        // Default options
    };

    // BullMQ Queues and Workers and Class
    private bullMQ: BullMQ;
    private bullMQQueues: Queue[];
    private bullMQWorkers: Worker[];

    // BullBoard Options for the applications
    private boardOptions: BoardOptions = {
        uiConfig: {
            boardTitle: "Wizarr BullMQ",
            boardLogo: {
                path: "https://wizarr.org/img/logo.svg",
            },
            miscLinks: [
                { text: "Back to Wizarr", url: "/admin" },
                { text: "Logout", url: "/api/auth/logout" },
            ],
            favIcon: {
                default: "/favicon.ico",
                alternative: "/favicon.ico",
            },
        },
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
                // {
                //     level: "info",
                //     target: "@wizarrrrr/pino-http-logger",
                //     options: {
                //         all: true,
                //         prettyOptions: {
                //             hideObject: true,
                //             ignore: "pid,hostname",
                //         },
                //     },
                // },
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
        authorizationChecker: controllerAuthorizationCheck,
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
    public log: Logger = this.logger.logger;

    /**
     * Constructor
     * @param options The options for the server
     */
    constructor(options?: typeof Koa.arguments) {
        // Merge the default options with the options passed in
        this.serverOptions = { ...this.serverOptions, ...options };
    }

    /**
     * Initialize the server
     */
    public async initialize() {
        // Create a KeyPair for the server if one does not exist
        if (!existsKeyPair()) await createKeyPair();

        // Initialize the server dependencies
        this.addProcessListeners();
        this.setupSentry();
        this.registerMiddlewares();
        this.useContainers();
        await this.createTypeORMConnection();
        this.registerSocketControllers();
        this.registerRoutingController();
        this.setupSwagger();
        await this.setupBullMQProcessor();
        this.setupBullBoard();
        this.registerRepeatableJobs();

        // Start the server
        this.httpServer.listen(this.port);

        // Handle server errors
        this.httpServer.on("error", (err) => {
            this.log.error(err, "Failed to start server");
            this.httpServer.close();
            process.exit(1);
        });

        // Handle server listening
        this.httpServer.on("listening", async () => {
            // Create the server table and print it
            const table = await this.createServerTable();
            table.printTable();
        });
    }

    /**
     * Create a table for server information
     */
    private async createServerTable() {
        return new Table({
            title: colors.blue("Backend Server Information"),
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
            console.error(err);
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
        this.app.use(pino(this.logger, Container));
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
     * Setup BullMQ for the server
     */

    private async setupBullMQProcessor() {
        // Create the BullMQ queues and workers instances
        this.bullMQ = new BullMQ(this.log);

        // Initialize the BullMQ queues and workers
        await this.bullMQ.initialize();

        // Set the BullMQ queues and workers
        this.bullMQQueues = Object.values(this.bullMQ.queues);
        this.bullMQWorkers = Object.values(this.bullMQ.workers);
    }

    /**
     * Setup BullBoard for the server
     */
    private async setupBullBoard() {
        // Get the server adapter
        const serverAdapter = new KoaAdapter();

        // Create the BullBoard server
        createBullBoard({
            queues: this.bullMQQueues.map((queue) => new BullMQAdapter(queue)),
            serverAdapter: serverAdapter,
            options: this.boardOptions,
        });

        serverAdapter.setBasePath("/api/bull");
        this.app.use(serverAdapter.registerPlugin());
    }

    /**
     * Register the repeatable jobs
     */
    private async registerRepeatableJobs() {
        // // Get the repeatable jobs
        // const scanUsers = await scanUsersJobs();
        // const scanLibraries = await scanLibrariesJobs();
        // // Add the repeatable jobs to the queues
        // scanUsers.forEach((job) => {
        //     this.bullMQ.queues.user.add(job.name, job.data, {
        //         repeat: { pattern: "0 * * * *" },
        //         ...job.opts,
        //     });
        // });
        // scanLibraries.forEach((job) => {
        //     this.bullMQ.queues.library.add(job.name, job.data, {
        //         repeat: { pattern: "0 * * * *" },
        //         ...job.opts,
        //     });
        // });
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
        const config = await swaggerConfig(schemas as Record<string, SchemaObject>);
        const spec = routingControllersToSpec(storage, { routePrefix }, config as any);

        // Render spec on route
        this.app.use((ctx, next) => {
            if (ctx.request.path === `${routePrefix}/openapion`) {
                ctx.body = spec;
            }
            return next();
        });

        // Save spec to root folder open-api if env GENERATE_OPENAPI is set
        if (process.env.GENERATE_OPENAPI) {
            const specPath = path.resolve(__dirname, "../../../../open-api/wizarr-openapi-specs.json");
            writeFileSync(specPath, JSON.stringify(spec, null, 2));
        }

        // Render swagger on route
        this.app.use(koaSwagger({ routePrefix: `${routePrefix}/docs`, swaggerOptions: { spec } }));
    }

    /**
     * Setup Sentry Reporting for the server
     */
    private async setupSentry() {
        // Initialize Sentry for error reporting
        useSentry({
            dsn: "https://83d66cc4eebae5180f434f54e9dabae6@sentry.wizarr.org/3",
            tracesSampleRate: 1.0,
            integrations: [
                // Automatically instrument Node libraries and frameworks
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
