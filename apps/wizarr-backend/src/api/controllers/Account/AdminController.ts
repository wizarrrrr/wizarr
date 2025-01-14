import "reflect-metadata";

import { Authorized, Get, JsonController, Param, QueryParams } from "routing-controllers";
import { Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { AdminService } from "../../../api/services/Account/AdminService";
import { RequestQueryParser } from "@wizarrrrr/typeorm-simple-query-parser";
import { OpenAPI } from "routing-controllers-openapi";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController("/admin")
@JsonController("/admins")
export class AdminController extends ControllerBase {
    /**
     * Creates an instance of AuthenticationController.
     */
    constructor(private adminService: AdminService) {
        super();
    }

    /**
     * @api {get} /admin Admin
     * @apiName Admin
     */
    @Get()
    @Authorized()
    public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.adminService.getAll(resourceOptions);
    }

    /**
     * @api {get} /admin/:id Admin
     * @apiName Admin
     */
    @Get("/:id([A-Za-z0-9-]+)")
    @Authorized()
    public async getOne(@Param("id") id: string, @QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.adminService.findOneById(id, resourceOptions);
    }
}
