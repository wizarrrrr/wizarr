import { privateKey } from "../../utils/secret.helper";
import { verify } from "jsonwebtoken";
import { Action, BadRequestError } from "routing-controllers";
import { Context, DefaultContext, DefaultState, Middleware, Next, ParameterizedContext } from "koa";
import { rolesCheck } from "./HasRole";
import { getCurrentUser } from "./CurrentUser";
import { InvalidCredentials } from "../../api/exceptions/InvalidCredentials";

import type { JwtPayload as IJwtPayload } from "jsonwebtoken";

export const controllerAuthorizationCheck = async (action: Action, roles: string | string[]): Promise<boolean> => {
    // Get the context from the action
    const context = action.context as Context;

    // Authorize client check
    return await authorizationCheck(context, roles);
};

export const koaAuthorizationCheck: Middleware = async (ctx, next) => {
    // Authorize client check
    if (await authorizationCheck(ctx, "admin")) return next();
};

export const authorizationCheck = async (ctx: Context | ParameterizedContext<DefaultState, DefaultContext, any>, roles: string | string[]) => {
    // Get the authorization header from the request or cookie if in development mode
    const authorization = ctx.request.headers.authorization ?? (process.env.NODE_ENV === "development" ? ctx.cookies.get("refresh") : undefined);

    // If the authorization header is not set, return false
    if (!authorization) throw new InvalidCredentials("No authorization header set");

    // Perform the local authorization check
    const payload = await localAuthorizationCheck<{ sub: string }>(authorization);

    // Inject current user into the context as Admin
    ctx.state.currentUser = await getCurrentUser(payload.sub);

    // If the current user is not set, return false
    if (!ctx.state.currentUser) throw new InvalidCredentials("Could not authenticate request");

    // If the payload is not set, return false
    if (!payload) return false;

    // Verify if the user has the required role and continue to the next middleware if it does
    if (rolesCheck(roles, ctx.state.currentUser)) {
        return true;
    }

    // Return true
    return false;
};

export const localAuthorizationCheck = async <T>(authorization: string): Promise<T> => {
    // If the authorization header is not set, throw an error
    if (!authorization) throw new Error("No authorization header set, please login");

    // Get the token from the authorization header
    const token = RegExp(/Bearer\s(\S+)/).exec(authorization)?.[1] ?? authorization;

    // If the token is not set, throw an error
    if (!token) throw new InvalidCredentials("Missing authorization token, please login");

    // Verify the token and get the payload
    const payload = await new Promise<IJwtPayload | string>(async (resolve, reject) => {
        try {
            resolve(verify(token, await privateKey(), { algorithms: ["RS256"] }));
        } catch (error) {
            reject(new InvalidCredentials("Invalid authorization token, try clearing your cache"));
        }
    });

    // If the payload is not set, throw an error
    if (!payload) throw new BadRequestError("Malformed authorization token payload, please login again");

    // Check if the payload is fresh
    if (process.env.NODE_ENV === "production" && (payload as Record<string, boolean>).fresh === false) throw new Error("Token is not fresh");

    // Return the payload
    return payload as T;
};
