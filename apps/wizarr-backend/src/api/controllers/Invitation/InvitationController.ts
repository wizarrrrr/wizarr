import { OpenAPI } from "routing-controllers-openapi";
import { Inject, Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from "routing-controllers";
import { InvitationService } from "../../services/Invitation/InvitationService";
import { RequestQueryParser } from "@wizarrrrr/typeorm-simple-query-parser";
import { Admin } from "../../models/Account/AdminModel";
import { InvitationRequest } from "../../requests/Invitation/InvitationRequest";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }], tags: ["Invitations"] })
@JsonController("/invitation")
@JsonController("/invitations")
export class InvitationController extends ControllerBase {
    /**
     * Creates an instance of InvitationController.
     */
    constructor(@Inject() private invitationService: InvitationService) {
        super();
    }

    /**
     * @api /invitation
     * @apiName Invitation
     * @apiDescription Create a new invitation
     */
    @Get()
    @OpenAPI({ summary: "Get all invitations" })
    @Authorized()
    public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser, @CurrentUser() currentUser: Admin) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.invitationService.getAll(resourceOptions, currentUser);
    }

    /**
     * @api /invitation/:id([A-Za-z0-9-]+)
     * @apiName Invitation
     * @apiDescription Get one invitation
     */
    @Get("/:id([A-Za-z0-9-]+)")
    @OpenAPI({ summary: "Get one invitation" })
    @Authorized()
    public async getOne(@Param("id") id: string, @QueryParams() parseResourceOptions: RequestQueryParser, @CurrentUser() currentUser: Admin) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.invitationService.findOneById(id, resourceOptions, currentUser);
    }

    /**
     * @api /invitation/:id([A-Za-z0-9-]+)
     * @apiName Invitation
     * @apiDescription Update an invitation
     */
    @Put("/:id([A-Za-z0-9-]+)")
    @OpenAPI({ summary: "Update an invitation" })
    @Authorized(["admin"])
    public async update(@Param("id") id: string, @Body() invitation: InvitationRequest, @CurrentUser() currentUser: Admin) {
        return this.invitationService.update(id, invitation, currentUser);
    }

    /**
     * @api /invitation
     * @apiName Invitation
     * @apiDescription Create a new invitation
     */
    @Post()
    @OpenAPI({ summary: "Create a new invitation" })
    @Authorized(["admin"])
    public async create(@Body() invitation: InvitationRequest, @CurrentUser() currentUser: Admin) {
        return this.invitationService.create(invitation, currentUser);
    }

    /**
     * @api /invitation/:id([A-Za-z0-9-]+)
     * @apiName Invitation
     * @apiDescription Delete an invitation
     */
    @Delete("/:id([A-Za-z0-9-]+)")
    @OpenAPI({ summary: "Delete an invitation" })
    @Authorized(["admin"])
    public async delete(@Param("id") id: string, @CurrentUser() currentUser: Admin) {
        return this.invitationService.delete(id, currentUser);
    }
}
