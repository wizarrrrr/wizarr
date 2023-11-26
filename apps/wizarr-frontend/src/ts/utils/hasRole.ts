import { useUserStore } from "@/stores/user";
import type { Admin } from "@wizarrrr/wizarr-sdk";

export const hasRole = (role: string | string[], user?: Admin) => {
    // Get the current user from the store or the parameter
    const currentUser = user ?? useUserStore().user;

    console.log(currentUser?.roles);

    // If there is no current user, return false
    if (!currentUser?.roles) return false;

    // If the current user is an admin, return true
    if (currentUser.roles.find((r) => r.name === "admin")) return true;

    // If the current user has the role or roles, return true
    if (currentUser.roles.find((r) => (Array.isArray(role) ? role.includes(r.name) : r.name === role))) return true;

    // Otherwise, return false
    return false;
};
