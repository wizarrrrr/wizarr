import "reflect-metadata"; // Enables decorators and metadata reflection used in routing-controllers and class-validator
import path from "path"; // Path module for resolving paths

// Register paths for application environment
process.env.ROOT_PATH = process.env.ROOT_PATH ?? path.resolve(__dirname, "../");
process.env.DB_DIR = process.env.DB_DIR ?? path.resolve(__dirname, "../../", "database");
process.env.STORAGE_DIR = process.env.STORAGE_DIR ?? path.resolve(__dirname, "../../", "storage");

import "./utils/modules.helper"; // Register module aliases for the application
import "./utils/env.helper"; // Load environment variables from .env file

// Core modules for creating REST APIs and WebSocket communication
import { getMetadataArgsStorage, RoutingControllersOptions, useContainer as useContainerRC, useKoaServer } from "routing-controllers"; // For setting up controllers and routes
import { SocketControllers } from "socket-controllers"; // For WebSocket-based communication
import { Container } from "typedi"; // Dependency injection container
import { routingControllersToSpec } from "routing-controllers-openapi"; // Convert routes to OpenAPI specs
import { validationMetadatasToSchemas } from "class-validator-jsonschema"; // Generate JSON schemas from class-validator metadata

// Swagger API documentation configuration
import { swaggerConfig } from "./config/swagger";
import { koaSwagger } from "koa2-swagger-ui"; // Middleware for serving Swagger UI

// Database and data-source configuration
import { connection } from "./config/connection";

// Utility for pretty-printing tables in the console
import { Table } from "console-table-printer";

// Versioning utilities to get current app version and determine beta status
import { getCurrentVersion, isBeta } from "./utils/versions.helper";

// Middleware for handling authentication and authorization
import { controllerAuthorizationCheck } from "./middlewares/router/Authentication/AuthenticationCheck"; // Middleware for route-level and app-level auth checks
import { currentUser } from "./middlewares/router/Authentication/CurrentUser"; // Middleware to fetch and attach the current user context

// OpenAPI types for defining schema objects
import { SchemaObject } from "openapi3-ts";

// Error tracking and monitoring using Sentry
import { init as useSentry, autoDiscoverNodePerformanceMonitoringIntegrations, withScope, captureException } from "@sentry/node"; // Sentry initialization and event tracking
import { addRequestDataToEvent } from "@sentry/utils"; // Helper to attach request data to Sentry events

// HTTP and WebSocket server creation
import { Server as HTTPServer, createServer } from "http"; // HTTP server
import { Server as SocketIOServer, ServerOptions } from "socket.io"; // Socket.IO server

// CORS configuration for cross-origin resource sharing
import { CorsOptions } from "cors";

// File system utilities for managing paths and writing files
import { writeFileSync } from "fs"; // File system module for writing files

// Job queue management using BullMQ
import { KoaAdapter } from "./bull/koaAdapter"; // Custom adapter to integrate Bull with Koa
import { createBullBoard } from "@bull-board/api"; // BullBoard for job queue monitoring
import { Queue, Worker } from "bullmq"; // BullMQ's Queue and Worker classes
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"; // Adapter to integrate BullMQ with BullBoard
import { BullMQ } from "./bull/index"; // BullMQ instance for managing queues
import { createKeyPair, existsKeyPair } from "./utils/secret.helper"; // Utility to manage encryption keys
import Redis, { RedisOptions } from "ioredis"; // Redis client for BullMQ

// BullBoard UI configuration types
import { BoardOptions } from "@bull-board/api/dist/typings/app";

// Application framework and middleware utilities
import Koa from "koa"; // Core Koa application framework
import cors from "@koa/cors"; // CORS middleware for handling cross-origin requests
import colors from "colors"; // Utility for adding colors to console output
import { createConsola } from "consola"; // Console logger with color output
import ip from "ip";
import logging from "./utils/logging.helper";
import { Options } from "pino-http";
import { TransportTargetOptions } from "pino";
import { PrettyOptions } from "pino-pretty";
import { release } from "os";
import { memcached } from "./config/memcached";


/**
 * The main application class for setting up and running the Koa server.
 */
export class App {
    // Define the Koa app and port
    private app: Koa = new Koa();
    private httpServer: HTTPServer = createServer(this.app.callback());
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
    private pinoOptions: Options & { transport: { targets: (TransportTargetOptions | { options: { prettyOptions: PrettyOptions } })[] } } = {
        timestamp: () => `,"time":"${new Date().toLocaleTimeString()}"`,
        transport: {
            targets: [
                {
                    level: "warn",
                    target: "pino/file",
                    options: {
                        destination: env("LOG_FILE", path.join(env("DB_DIR"), "/logs/warn.log")),
                        mkdir: true,
                    },
                },
                {
                    level: "info",
                    target: "@wizarrrrr/pino-http-logger",
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
        authorizationChecker: controllerAuthorizationCheck,
        currentUserChecker: currentUser,
        cors: true,
        routePrefix: "/api",
        classTransformer: true,
        defaultErrorHandler: false,
        controllers: [path.join(__dirname, "/api/controllers/router/**/*.{js,ts}")],
        middlewares: [path.join(__dirname, "/middlewares/router/**/*.{js,ts}")],
    };

    // Define the socket.io options
    private socketIOOptions: Partial<ServerOptions> = {
        // Default options
        cors: this.corsOptions,
    };

    // Define the logger for the application
    private logger = createConsola({ fancy: true });
    public log = this.logger;

    /**
     * Constructor
     * @param options The options for the server
     */
    constructor(options?: typeof Koa.arguments) {
        // Merge the default options with the options passed in
        this.serverOptions = { ...this.serverOptions, ...options };
        this.initialize();
    }

    /**
     * Initialize the server
     */
    public async initialize() {
        // Check connections to services required in the application
        await this.checkRedisConnection();

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

        // Start the server
        this.httpServer.listen(this.port);

        // Handle server errors
        this.httpServer.on("error", (err) => {
            this.log.error(err.message);
            this.httpServer.close();
            process.exit(1);
        });

        // Handle server listening
        this.httpServer.on("listening", async () => {
            this.createServerTable();
        });
    }

    /**
     * Check if Redis connection is able to be established
     */
    private async checkRedisConnection() {
        // Get the Redis connection details
        const redis = new Redis({
            host: env("REDIS_HOST", "localhost"),
            port: env("REDIS_PORT", 6379),
            username: env("REDIS_USERNAME", undefined),
            password: env("REDIS_PASSWORD", undefined),
            maxRetriesPerRequest: 3,
            enableReadyCheck: false,
        } as RedisOptions);

        redis.on("error", (err) => {
            this.log.box({
                title: colors.bold.red(" Failed to connect to Redis "),
                message: colors.red(`Failed to connect to Redis at:\n${colors.bold(`${redis.options.host}:${redis.options.port}`)}\n\nPlease check the connection and try again`),
                style: { borderColor: "red", borderStyle: "double-single-rounded" },
            });
            process.exit(0);
        });
    }

    /**
     * Creates and logs a formatted server information table.
     */
    private async createServerTable() {
        /**
         * Generates a consistent style object for table formatting.
         * @param val - Optional value to assign to all style keys.
         * @returns An object with uniform styling for table elements.
         */
        const sharedValues = (val: string = "") => Object.fromEntries(["left", "mid", "right", "other"].map((k) => [k, val])) as Record<"left" | "mid" | "right" | "other", string>;

        /**
         * Creates a formatted table row with specified columns.
         * @param args - Column values for the table row.
         * @returns A formatted string representing a single table row.
         */
        const table = (...args: string[]) => {
            const rawTable = new Table({
                style: {
                    headerTop: sharedValues(), // Empty top border
                    headerBottom: sharedValues(" "), // Spaced bottom border
                    tableBottom: sharedValues(), // Empty bottom border
                    vertical: "", // No vertical separators
                },
            });

            args.forEach((text) => rawTable.addColumn(text)); // Add each argument as a column

            // Render table and remove unnecessary top and bottom lines
            const lines = rawTable.render().split("\n");
            return lines.length > 2 ? lines.slice(1, -2).join("\n") : "";
        };

        // Fetch server information
        const webAddress = colors.bold.blue.underline(`http://${ip.address()}:5173`);
        const apiAddress = colors.bold.blue.underline(`http://${ip.address()}:${this.port}/api`);
        const dbAddress = env("DB_TYPE", "postgres") === "postgres" ? colors.bold.blue.underline(`postgres://${env("DB_USERNAME", "postgres")}:${"".padEnd(env("DB_PASSWORD", "postgres").length, "*")}@${env("DB_HOST", "localhost")}:${env("DB_PORT", "5432")}/${env("DB_NAME", "postgres")}`) : colors.blue.bold.underline(`${env("DB_DIR")}/wizarr.db`);
        const redisAddress = colors.bold.blue.underline(`redis://${env("REDIS_HOST", "localhost")}:${env("REDIS_PORT", 6379)}`);
        const memcachedAddress = colors.bold.blue.underline(`memcached://${env("MEMCACHED_HOST", "localhost")}:${env("MEMCACHED_PORT", 11211)}`);

        const currentVersion = await getCurrentVersion();
        const isBetaVersion = await isBeta();
        const serverVersion = colors.bold.green(isBetaVersion ? colors.yellow(currentVersion) : colors.green(currentVersion));
        const serverChannel = colors.bold.green(isBetaVersion ? colors.yellow("BETA") : colors.green("STABLE"));
        const systemVersion = colors.bold.green(release());

        const buildID = env("WIZARR_BUILD", colors.yellow("NOT BUILT"));
        const commitREF = env("WIZARR_SOURCE_COMMIT", colors.yellow("NO PULL REQUEST"));
        const repoSHEBANG = env("WIZARR_REPOSITORY", colors.yellow("NONE DETECTED"));

        // Log the server details inside a styled box
        this.log.box({
            title: colors.bold(" 🚀 Wizarr Server 🚀 "), // Box title
            message: [
                table("🌎", colors.bold("  WEB ADDRESS:"), webAddress),
                table("🤖", colors.bold("  API ADDRESS:"), apiAddress),
                table("💾", colors.bold(" DATABASE URL:"), dbAddress),
                table("📑", colors.bold("    REDIS URL:"), redisAddress),
                table("📦", colors.bold("MEMCACHED URL:"), memcachedAddress),
                "", // Line break for spacing
                table("🔔", colors.bold(" WIZARR VERSION:"), serverVersion),
                table("📢", colors.bold(" WIZARR CHANNEL:"), serverChannel),
                table("🔧", colors.bold(" SYSTEM VERSION:"), systemVersion),
                "", // Line break for spacing
                table(colors.bold("BUILD ID:"), buildID),
                table(colors.bold("COMMIT REF:"), commitREF),
                table(colors.bold("REPOSITORY:"), repoSHEBANG),
            ].join("\n"),
            style: {
                padding: 1, // Adds padding inside the box
                borderStyle: "double-single-rounded", // Custom border style
            },
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
            this.log.fatal("Could not connect to database");
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
        this.app.use(logging(this.logger, this.pinoOptions, Container));
        this.app.use(cors(this.corsOptions));

        // Override console with consola
        this.logger.wrapAll();
    }

    /**
     * Register the socket.io server
     */
    private registerSocketControllers() {
        const io = new SocketIOServer(this.httpServer, this.socketIOOptions);

        this.app.use((ctx, next) => ((ctx.io = io), next()));

        return new SocketControllers({
            io: io,
            container: Container,
            controllers: [path.join(__dirname, "/api/controllers/socket/**/*.{js,ts}")],
            middlewares: [path.join(__dirname, "/middlewares/socket/**/*.{js,ts}")],
        });
    }

    /**
     * Setup BullMQ for the server
     */
    private async setupBullMQProcessor() {
        // Create the BullMQ queues and workers instances
        this.bullMQ = new BullMQ(this.logger);

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
        if (env("NODE_ENV") === "development" && env("GENERATE_OPENAPI") === "true") {
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
            environment: env("NODE_ENV", "production"),
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
            this.log.warn(this.shutdownObjectInfo("EXIT"), "Process exited.");
            this.httpServer.close();
            memcached.flush((err) => {
                if (err) return this.log.error("Memcached flush failed:", err);
                this.log.success("Memcached flushed.");
            });
            process.exit(0);
        });

        // Handle process termination
        process.on("SIGTERM", async () => {
            this.log.warn(this.shutdownObjectInfo("SIGTERM"), "SIGTERM signal received.");
            this.httpServer.close();
            memcached.flush((err) => {
                if (err) return this.log.error("Memcached flush failed:", err);
                this.log.success("Memcached flushed.");
            });
            process.exit(0);
        });

        // Handle process interruption
        process.on("SIGINT", async () => {
            this.log.warn(this.shutdownObjectInfo("SIGINT"), "SIGINT signal received.");
            this.httpServer.close();
            memcached.flush((err) => {
                if (err) return this.log.error("Memcached flush failed:", err);
                this.log.success("Memcached flushed.");
            });
            process.exit(0);
        });
    }
}

const app = new App();
export default app;
