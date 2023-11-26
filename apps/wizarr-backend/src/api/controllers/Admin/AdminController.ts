import { Authorized, Get, JsonController, Param, QueryParam, QueryParams } from "routing-controllers";
import { Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { AdminService } from "@/api/services/Admin/AdminService";
import { RequestQueryParser } from "typeorm-simple-query-parser";
import { OpenAPI } from "routing-controllers-openapi";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController("/admin")
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
        return await this.adminService.getAll(resourceOptions);
    }

    /**
     * @api {get} /admin/:id Admin
     * @apiName Admin
     */
    @Get("/:id(.*)")
    @Authorized()
    public async getOne(@Param("id") id: string, @QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return await this.adminService.findOneById(id, resourceOptions);
    }
}
