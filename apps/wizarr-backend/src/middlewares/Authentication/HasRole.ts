import { InvalidCredentials } from "../../api/exceptions/InvalidCredentials";
import { InvalidRoles } from "../../api/exceptions/InvalidRoles";
import { Admin } from "@/api/models/AdminModel";
import { Context } from "vm";

export const rolesCheck = (roles: string | string[], user: Admin): boolean => {
    // If the roles are not set, return true
    if (!roles) return true;

    // If the user is an admin, continue to the next middleware
    if (user.roles.filter((role) => role.name === "admin").length > 0) return true;

    // If the user is not an admin, check if the user has the required role
    if ((Array.isArray(roles) && user.roles.filter((role) => roles.includes(role.name)).length > 0) || (roles instanceof String && user.roles.filter((role) => role.name === roles).length > 0)) {
        return true;
    }

    // Return false
    return false;
};

export const HasRole = (roles: string | string[]): any => {
    return async function (ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
        // Get the logged in user from the context
        const user = ctx.state.currentUser as Admin;

        // If the user is not set, throw an error
        if (!user) throw new InvalidCredentials("You are not logged in");

        // Verify if the user has the required role and continue to the next middleware if it does
        if (rolesCheck(roles, user)) {
            return next();
        }

        // If the user does not have the required role, throw an error
        throw new InvalidRoles("You do not have the required role(s) to access this resource");
    };
};
