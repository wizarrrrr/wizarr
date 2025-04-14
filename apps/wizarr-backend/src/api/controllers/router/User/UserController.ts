import { Authorized, CurrentUser, Get, JsonController, Param, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Inject, Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { UserService } from "../../../services/User/UserService";
import { LoggerInterface } from "../../../../decorators/LoggerDecorator";
import { UserEntity } from "../../../models/Account/UserEntity";
import { RequestQueryParser } from "@wizarrrrr/typeorm-simple-query-parser";

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
    public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser, @CurrentUser() currentUser: UserEntity) {
        const resourceOptions = parseResourceOptions.getAll();
        return this.userService.getAll(resourceOptions, currentUser);
    }

    /**
     * @api /scan
     * @apiName Scan
     * @apiDescription Scan for users
     */
    @Get("/scan")
    @OpenAPI({ summary: "Scan for users" })
    @Authorized()
    public async scan() {
        return this.userService.scan();
    }

    /**
     * @api /scan/:serverId
     * @apiName ScanUsers
     * @apiDescription Scan for users on a specific server
     */
    @Get("/scan/:serverId")
    @OpenAPI({ summary: "Scan for users on a specific server" })
    @Authorized()
    public async scanUsers(@Param("serverId") serverId: string) {
        return this.userService.scan(serverId);
    }
}
