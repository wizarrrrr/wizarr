import "reflect-metadata";

import { getMetadataArgsStorage, RoutingControllersOptions, useContainer as useContainerRC, useKoaServer } from "routing-controllers";
import { SocketControllers } from "socket-controllers";
import { Container } from "typedi";
import { registerModuleAlias } from "./utils/modules.helper";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { swaggerConfig } from "./config/swagger";
import { koaSwagger } from "koa2-swagger-ui";
import { Connection } from "./data-source";
import { Table } from "console-table-printer";
import { getCurrentVersion, isBeta } from "./utils/versions.helper";
import { authorizationCheck } from "./middlewares/Authentication/AuthenticationCheck";
import { currentUser } from "./middlewares/Authentication/CurrentUser";
import { SchemaObject } from "openapi3-ts";

import koa from "koa";
import http from "http";
import path from "path";
import socketIO, { ServerOptions } from "socket.io";
import colors from "colors";

registerModuleAlias(__dirname);

export class App {
    // Define the Koa app and port
    private app: koa = new koa();
    // private app: express.Application = express();
    private port: number = 5001;

    // Define the server options for Koa
    private serverOptions: typeof koa.arguments = {
        // Default options
    };

    // Define the routing controller options
    private routingControllerOptions: RoutingControllersOptions = {
        validation: { stopAtFirstError: true },
        authorizationChecker: authorizationCheck,
        currentUserChecker: currentUser,
        cors: false,
        routePrefix: "/api",
        classTransformer: true,
        defaultErrorHandler: true,
        controllers: [path.join(__dirname, "/api/controllers/**/*.{js,ts}")],
        middlewares: [path.join(__dirname, "/middlewares/**/*.{js,ts}")],
    };

    // Define the socket.io options
    private socketIOOptions: Partial<ServerOptions> = {
        // Default options
        path: this.routingControllerOptions.routePrefix + "/socket.io",
    };

    /**
     * Constructor
     * @param options The options for the server
     */
    constructor(options?: typeof koa.arguments) {
        // Merge the default options with the options passed in
        this.serverOptions = { ...this.serverOptions, ...options };

        // Initialize the server
        this.initialize();

        // Start the server
        this.app.listen(this.port, async () => console.log((await this.createServerTable()).render()));
    }

    /**
     * Initialize the server
     */
    public async initialize() {
        this.useContainers();
        await this.createTypeORMConnection();
        this.registerMiddlewares();
        this.registerSocketControllers();
        this.registerRoutingController();
        await this.setupSwagger();
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
        // useContainerTO(ContainerTO);
    }

    /**
     * Create the TypeORM connection
     */
    private async createTypeORMConnection() {
        // await createConnection();
        await Connection.initialize();
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
    private registerMiddlewares() {}

    /**
     * Register the socket.io server
     */
    private registerSocketControllers() {
        const server = http.createServer(this.app.callback());
        const io = new socketIO.Server(server, this.socketIOOptions);

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
        this.app.use(koaSwagger({ routePrefix: `${routePrefix}/docs`, swaggerOptions: { spec } }));
    }
}

const app = new App();
