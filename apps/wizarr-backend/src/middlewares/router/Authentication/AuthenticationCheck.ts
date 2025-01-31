import { privateKey } from "../../../utils/secret.helper";
import { verify } from "jsonwebtoken";
import { Action, BadRequestError } from "routing-controllers";
import { Context, Middleware, ParameterizedContext, DefaultState, DefaultContext } from "koa";
import { rolesCheck } from "./HasRole";
import { getCurrentUser } from "./CurrentUser";
import { InvalidCredentials } from "../../../api/exceptions/InvalidCredentials";

import type { JwtPayload as IJwtPayload } from "jsonwebtoken";

/**
 * Authorization check for controllers in routing-controllers.
 */
export const controllerAuthorizationCheck = async (action: Action, roles: string | string[]): Promise<boolean> => {
    const ctx = action.context as Context; // Extract context from action
    return await authorizationCheck(ctx, roles);
};

/**
 * Authorization middleware for Koa.
 */
export const koaAuthorizationCheck: Middleware = async (ctx, next) => {
    if (await authorizationCheck(ctx, "admin")) {
        return next();
    }
};

/**
 * Checks the validity of an authorization token and connects the user.
 */
export const authorizationTokenCheck = async (token: string): Promise<boolean> => {
    const payload = await localAuthorizationCheck<{ sub: string }>(token);

    if (!payload) return false;

    const user = await getCurrentUser(payload.sub);

    console.log("\x1b[32m", `${user.name} connected to websocket`, "\x1b[0m");

    return !!user; // Return true only if user is valid
};

/**
 * General authorization check with role validation.
 */
export const authorizationCheck = async (
    ctx: Context | ParameterizedContext<DefaultState, DefaultContext>,
    roles: string | string[]
): Promise<boolean> => {
    const authorization = ctx.request.headers.authorization ?? ctx.cookies.get("refresh");

    if (!authorization) throw new InvalidCredentials("No authorization header set");

    const payload = await localAuthorizationCheck<{ sub: string }>(authorization);

    ctx.state.currentUser = await getCurrentUser(payload.sub);

    if (!ctx.state.currentUser) throw new InvalidCredentials("Could not authenticate request");

    if (rolesCheck(roles, ctx.state.currentUser)) {
        return true;
    }

    return false;
};

/**
 * Validates and extracts payload from the authorization token.
 */
export const localAuthorizationCheck = async <T>(authorization: string): Promise<T> => {
    if (!authorization) throw new InvalidCredentials("No authorization header set, please login");

    const token = RegExp(/Bearer\s(\S+)/).exec(authorization)?.[1] ?? authorization;

    if (!token) throw new InvalidCredentials("Missing authorization token, please login");

    const key = await privateKey(); // Await the privateKey here

    try {
        const payload = await new Promise<IJwtPayload | string>((resolve, reject) => {
            verify(token, key, { algorithms: ["RS256"] }, (err, decoded) => {
                if (err) return reject(new InvalidCredentials("Invalid authorization token, try clearing your cache"));
                resolve(decoded);
            });
        });

        if (!payload) throw new BadRequestError("Malformed authorization token payload, please login again");

        if (process.env.NODE_ENV === "production" && !(payload as Record<string, boolean>).fresh) {
            throw new Error("Token is not fresh");
        }

        return payload as T;
    } catch (error) {
        throw error instanceof InvalidCredentials ? error : new BadRequestError(error.message);
    }
};
