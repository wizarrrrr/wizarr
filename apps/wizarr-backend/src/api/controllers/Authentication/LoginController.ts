import { JsonController, Post, Body, Get, Ctx } from "routing-controllers";
import { LoginRequest } from "@/api/requests/Authentication/LoginRequest";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import { LoginService } from "@/api/services/Authentication/LoginService";
import { ControllerBase } from "../BaseController";
import { Context } from "koa";

@Service()
@JsonController("/auth")
export class LoginController extends ControllerBase {
    /**
     * Creates an instance of AuthenticationController.
     */
    constructor(private loginService: LoginService) {
        super();
    }

    /**
     * @api {post} /login Login
     * @apiName Login
     */
    @Post("/login")
    @OpenAPI({ summary: "Login to the server with your username and password" })
    public async login(@Body() user: LoginRequest, @Ctx() context: Context) {
        return this.loginService.login(user, context);
    }

    /**
     * @api {get} /logout Logout
     * @apiName Logout
     */
    @Get("/logout")
    @OpenAPI({ summary: "Logout of the server" })
    public async logout(@Ctx() context: Context) {
        return this.loginService.logout(context);
    }

    /**
     * @api {get} /refresh Refresh JWT Token
     * @apiName Refresh JWT Token
     */
    @Get("/refresh")
    @OpenAPI({ summary: "Refresh JWT Token" })
    public async refresh() {
        // return this.loginService.refresh();
    }
}
