import { Authorized, CurrentUser, Get, JsonController, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Inject, Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { UserService } from "@/api/services/User/UserService";
import { LoggerInterface } from "@/decorators/LoggerDecorator";
import { Admin } from "@/api/models/Account/AdminModel";
import { RequestQueryParser } from "@wizarrrr/typeorm-simple-query-parser";

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }], tags: ["Users"] })
@JsonController("/users")
export class UserController extends ControllerBase {
    /**
     * Creates an instance of UserController.
     */
    constructor(private userService: UserService) {
        super();
    }

    @Inject("Logger") private logger: LoggerInterface;

    /**
     * @api /users
     * @apiName Users
     * @apiDescription Get all users
     */
    @Get()
    @OpenAPI({ summary: "Get all users" })
    @Authorized()
    public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser, @CurrentUser() currentUser: Admin) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.userService.getAll(resourceOptions, currentUser);
    }
}
