import { Authorized, Get, JsonController, Param, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { RoleService } from "../../../api/services/Account/RoleService";
import { RequestQueryParser } from "@wizarrrrr/typeorm-simple-query-parser";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController("/role")
@JsonController("/roles")
export class RoleController extends ControllerBase {
    /**
     * Creates an instance of RoleController.
     */
    constructor(private roleService: RoleService) {
        super();
    }

    /**
     * @api {get} /role Role
     * @apiName Role
     */
    @Get()
    @Authorized()
    public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return await this.roleService.getAll(resourceOptions);
    }

    /**
     * @api {get} /role/:id Role
     * @apiName Role
     */
    @Get("/:id([0-9]+)")
    @Authorized()
    public async getOne(@Param("id") id: string, @QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return await this.roleService.findOneById(id, resourceOptions);
    }
}
