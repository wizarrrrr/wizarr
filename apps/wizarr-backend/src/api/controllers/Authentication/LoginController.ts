import { JsonController, Post, Body, Get, Ctx, CurrentUser, Authorized } from "routing-controllers";
import { LoginRequest } from "@/api/requests/Authentication/LoginRequest";
import { OpenAPI } from "routing-controllers-openapi";
import { Inject, Service } from "typedi";
import { LoginService } from "@/api/services/Authentication/LoginService";
import { ControllerBase } from "../BaseController";
import { Context } from "koa";
import { Admin } from "@/api/models/Account/AdminModel";

@Service()
@OpenAPI({ tags: ["Authentication"] })
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
    public async refresh(@Ctx() context: Context) {
        return this.loginService.refresh(context);
    }

    /**
     * @api {get} /me Get the current user
     * @apiName Get the current user
     */
    @Get("/me")
    @OpenAPI({ summary: "Get the current user" })
    @Authorized()
    public async me(@CurrentUser() user: Admin) {
        return user;
    }
}
