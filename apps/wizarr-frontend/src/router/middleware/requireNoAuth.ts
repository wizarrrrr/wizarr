import { useAuthStore } from "@/stores/auth";
import type { NavigationGuardNext, Router } from "vue-router";

type AuthStore = ReturnType<typeof useAuthStore>;
type MiddlewareContext = { next: NavigationGuardNext; parameters: { authStore: AuthStore; router: Router } };

export default async function requireNoAuth({ next, parameters }: MiddlewareContext) {
    if (parameters.authStore.isLoggedIn) parameters.router.push({ name: "admin" });
    return next();
}
