import "reflect-metadata";
import { Authorized, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { SchemaService } from "../../../services/Database/SchemaService";
import { OpenAPI } from "routing-controllers-openapi";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController("/database/schema")
export class SchemaController extends ControllerBase {
    /**
     * Create an instance of SchemaController.
     */
    constructor(private schemaService: SchemaService) {
        super();
    }

    /**
     * @api {get} /database/schema Get Database Schema
     * @apiName GetSchema
     */
    @Get()
    @Authorized()
    public async getSchema() {
        return this.schemaService.getSchema();
    }
}
