import { useAuthStore } from "@/stores/auth";
import type { NavigationGuardNext, Router } from "vue-router";

type AuthStore = ReturnType<typeof useAuthStore>;
type MiddlewareContext = { next: NavigationGuardNext; parameters: { authStore: AuthStore; router: Router } };

export default async function requireAuth({ next, parameters }: MiddlewareContext) {
    // URL Safe string
    const attemptedURL = encodeURIComponent(window.location.pathname);

    // Redirect to login page if not authenticated and save the attempted URL in the query parameter for redirection after login
    // The attempted URL will be decoded in the login component to restore the original route after login
    if (!parameters.authStore.isLoggedIn) parameters.router.push({ name: "login", query: { url: attemptedURL } });
    return next();
}
