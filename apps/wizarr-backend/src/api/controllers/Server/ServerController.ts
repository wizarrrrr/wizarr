import { Authorized, Body, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Post, Put, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Inject, Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { ServerService } from "@/api/services/Server/ServerService";
import { RequestQueryParser } from "@wizarrrr/typeorm-simple-query-parser";
import { ServerRequest } from "@/api/requests/Server/ServerPostRequest";
import { Admin } from "@/api/models/Account/AdminModel";
import { LoggerInterface } from "@/decorators/LoggerDecorator";
import { AdminService } from "@/api/services/Account/AdminService";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }], tags: ["Media Servers"] })
@JsonController("/server")
@JsonController("/servers")
export class ServerController extends ControllerBase {
    /**
     * Creates an instance of MediaServerController.
     */
    constructor(@Inject() private serverService: ServerService) {
        super();
    }

    @Inject("Logger") private logger: LoggerInterface;

    /**
     * @api /server Server
     * @apiName Server
     * @apiDescription Get all servers
     */
    @Get()
    @OpenAPI({ summary: "Get all servers" })
    @Authorized()
    public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser, @CurrentUser() currentUser: Admin) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.serverService.getAll(resourceOptions, currentUser);
    }

    /**
     * @api /server/:id Server
     * @apiName Server
     * @apiDescription Get one server
     */
    @Get("/:id([A-Za-z0-9-]+)")
    @OpenAPI({ summary: "Get one server" })
    @Authorized()
    public async getOne(@Param("id") id: string, @QueryParams() parseResourceOptions: RequestQueryParser, @CurrentUser() currentUser: Admin) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.serverService.findOneById(id, resourceOptions, currentUser);
    }

    /**
     * @api /server
     * @apiName Server
     * @apiDescription Create a new server
     */
    @Post()
    @OpenAPI({ summary: "Create a new server" })
    @HttpCode(201)
    @Authorized(["admin"])
    public async create(@Body() server: ServerRequest, @CurrentUser() currentUser: Admin) {
        this.logger.info("Creating a new server");
        return this.serverService.create(server, currentUser);
    }

    /**
     * @api /server/:id
     * @apiName Server
     * @apiDescription Update a server
     */
    @Put("/:id([A-Za-z0-9-]+)")
    @OpenAPI({ summary: "Update a server" })
    @Authorized(["admin"])
    public async update(@Param("id") id: string, @Body() server: Partial<ServerRequest>, @CurrentUser() currentUser: Admin) {
        this.logger.info("Updating server with id: " + id);
        return this.serverService.update(id, server, currentUser);
    }

    /**
     * @api /server/:id
     * @apiName Server
     * @apiDescription Delete a server
     */
    @Delete("/:id([A-Za-z0-9-]+)")
    @OpenAPI({ summary: "Delete a server" })
    @Authorized(["admin"])
    public async delete(@Param("id") id: string, @CurrentUser() currentUser: Admin) {
        return this.serverService.delete(id, currentUser);
    }
}
