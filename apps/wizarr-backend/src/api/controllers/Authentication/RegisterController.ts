import { RegisterService } from "../../services/Authentication/RegisterService";
import { Body, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { OpenAPI } from "routing-controllers-openapi";
import { RegisterRequest } from "../../requests/Authentication/RegisterRequest";

@Service()
@OpenAPI({ tags: ["Authentication"] })
@JsonController("/auth")
export class RegisterController extends ControllerBase {
    /**
     * Creates an instance of AuthenticationController.
     * @param containers
     * @returns
     */
    constructor(private registerService: RegisterService) {
        super();
    }

    /**
     * @api {post} /register Register
     * @apiName Register
     */
    @Post("/register")
    @OpenAPI({ summary: "Register a new user" })
    public async register(@Body() user: RegisterRequest) {
        return this.registerService.register(user);
    }
}
