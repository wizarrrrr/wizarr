import { useAuthStore } from "@/stores/auth";
import type { Admin } from "@wizarrrrr/wizarr-sdk";

const authStore = useAuthStore();
export const hasRole = (role: string | string[], user?: Admin) => {
    // Get the current user from the store or the parameter
    const currentUser = user ?? authStore.user;

    // If there is no current user, return false
    if (!currentUser?.roles) return false;

    // If the current user is an admin, return true
    if (currentUser.roles.find((r) => r.name === "admin")) return true;

    // If the current user has the role or roles, return true
    if (currentUser.roles.find((r) => (Array.isArray(role) ? role.includes(r.name) : r.name === role))) return true;

    // Otherwise, return false
    return false;
};
