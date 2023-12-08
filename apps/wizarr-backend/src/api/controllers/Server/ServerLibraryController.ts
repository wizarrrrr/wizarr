import { Authorized, Get, JsonController, Param, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Inject, Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { RequestQueryParser } from "@wizarrrr/typeorm-simple-query-parser";
import { ServerLibraryService } from "../../services/Server/ServerLibraryService";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }], tags: ["Media Server Libraries"] })
@JsonController("/library")
@JsonController("/libraries")
export class ServerLibraryController extends ControllerBase {
    /**
     * Creates an instance of MediaServerController.
     */
    constructor(private serverLibraryService: ServerLibraryService) {
        super();
    }

    /**
     * @api /library Library
     */
    @Get()
    @OpenAPI({ summary: "Get all libraries" })
    @Authorized()
    public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.serverLibraryService.getAll(resourceOptions);
    }

    /**
     * @api /library/:id Library
     */
    @Get("/:id([A-Za-z0-9-]+)")
    @OpenAPI({ summary: "Get one library" })
    @Authorized()
    public async getOneLibrary(@Param("id") id: string, @QueryParams() parseResourceOptions: RequestQueryParser) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.serverLibraryService.findOneById(id, resourceOptions);
    }
}
