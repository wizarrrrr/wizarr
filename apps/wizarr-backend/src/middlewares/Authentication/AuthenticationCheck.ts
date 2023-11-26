import { Admin } from "../../api/models/AdminModel";
import { privateKey } from "../../utils/secret.helper";
import { verify } from "jsonwebtoken";
import { Action, KoaMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { Context } from "vm";
import { rolesCheck } from "./HasRole";
import { plainToClass } from "class-transformer";

export const authorizationCheck = async (action: Action, roles: any[]): Promise<boolean> => {
    // Get the context from the action
    const context = action.context as Context;

    // Get the authorization header from the request or cookie
    const authorization = context.request.headers.authorization ?? context.cookies.get("token");

    // Perform the local authorization check
    const payload = await localAuthorizationCheck<{ user: Admin }>(authorization);

    // If the payload is not set, return false
    if (!payload) return false;

    // Verify if the user has the required role and continue to the next middleware if it does
    if (rolesCheck(roles, payload.user)) {
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
    const payload = verify(token, await privateKey(), { algorithms: ["RS256"] }) as { user: Admin };

    // If the payload is not set, throw an error
    if (!payload) throw new Error("No payload set");

    // Return the payload
    return payload as T;
};

@Service()
export class AuthenticationCheck implements KoaMiddlewareInterface {
    /**
     * @param ctx
     * @param next
     * @returns
     */
    public async use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
        // Get the authorization header from the request
        const authorization = ctx.request.headers.authorization ?? ctx.cookies.get("token");

        // Perform the local authorization check
        const payload = await localAuthorizationCheck<{ user: Admin }>(authorization);

        // Inject current user into the context as Admin
        ctx.state.currentUser = plainToClass(Admin, payload.user);

        // Continue to the next middleware
        await next();
    }
}
