import { Authorized, Get, JsonController, Param, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { SessionService } from "../../../api/services/Account/SessionService";
import { RequestQueryParser } from "typeorm-simple-query-parser";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController("/session")
@JsonController("/sessions")
export class SessionController extends ControllerBase {
    /**
     * Creates an instance of SessionController.
     */
    constructor(private sessionService: SessionService) {
        super();
    }

    /**
     * @api {get} /session Session
     * @apiName Session
     */
    @Get()
    @Authorized()
    public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return await this.sessionService.getAll(resourceOptions);
    }

    /**
     * @api {get} /session/:id Session
     * @apiName Session
     */
    @Get("/:id([0-9]+)")
    @Authorized()
    public async getOne(@Param("id") id: string, @QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return await this.sessionService.findOneById(id, resourceOptions);
    }
}
