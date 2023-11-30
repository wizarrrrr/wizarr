import { privateKey } from "../../utils/secret.helper";
import { verify } from "jsonwebtoken";
import { Action } from "routing-controllers";
import { Context } from "vm";
import { rolesCheck } from "./HasRole";
import { getCurrentUser } from "./CurrentUser";
import { InvalidCredentials } from "../../api/exceptions/InvalidCredentials";

export const authorizationCheck = async (action: Action, roles: any[]): Promise<boolean> => {
    // Get the context from the action
    const context = action.context as Context;

    // Get the authorization header from the request or cookie if in development mode
    const authorization = context.request.headers.authorization ?? (process.env.NODE_ENV === "development" ? context.cookies.get("refresh") : undefined);

    // If the authorization header is not set, return false
    if (!authorization) throw new InvalidCredentials("No authorization header set");

    // Perform the local authorization check
    const payload = await localAuthorizationCheck<{ sub: string }>(authorization);

    // Inject current user into the context as Admin
    context.state.currentUser = await getCurrentUser(payload.sub).catch(() => undefined);

    // If the current user is not set, return false
    if (!context.state.currentUser) throw new InvalidCredentials("Could not authenticate request");

    // If the payload is not set, return false
    if (!payload) return false;

    // Verify if the user has the required role and continue to the next middleware if it does
    if (rolesCheck(roles, context.state.currentUser)) {
        return true;
    }

    // Return true
    return false;
};

export const localAuthorizationCheck = async <T>(authorization: string): Promise<T> => {
    // If the authorization header is not set, throw an error
    if (!authorization) throw new Error("No authorization header set");

    // Get the token from the authorization header
    const token = RegExp(/Bearer\s(\S+)/).exec(authorization)?.[1] ?? authorization;

    // If the token is not set, throw an error
    if (!token) throw new Error("No token set");

    // Verify the token and get the payload
    const payload = verify(token, await privateKey(), { algorithms: ["RS256"] });

    // If the payload is not set, throw an error
    if (!payload) throw new Error("No payload set");

    // Check if the payload is fresh
    if (process.env.NODE_ENV === "production" && (payload as Record<string, boolean>).fresh === false) throw new Error("Token is not fresh");

    // Return the payload
    return payload as T;
};
