import { RegisterService } from "@/api/services/Authentication/RegisterService";
import { Get, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { OpenAPI } from "routing-controllers-openapi";

@Service()
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
    @Get("/register")
    @OpenAPI({ summary: "Register a new user" })
    public async register() {
        await this.registerService.register();
        return { status: "OK" };
    }
}
