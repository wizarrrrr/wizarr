import { Admin } from "../../api/models/Account/AdminModel";

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
