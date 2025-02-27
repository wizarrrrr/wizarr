import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import { useAuthStore } from "@/stores/auth";

// Import the middleware pipeline
import middlewarePipeline from "./middlewarePipeline";

// Import all Routes from the modules
import homeRoutes from "@/modules/home/router";
import authenticationRoutes from "@/modules/authentication/router";
import joinRoutes from "@/modules/join/router";
import adminRoutes from "@/modules/admin/router";
import settingsRoutes from "@/modules/settings/router";
import helpRoutes from "@/modules/help/router";
import requestRoutes from "@/modules/requests/router";
import setupRoutes from "@/modules/setup/router";
import docsRoutes from "@/modules/docs/router";
import coreRoutes from "@/modules/core/router";
import { useTitle } from "@vueuse/core";
import { computed, ref } from "vue";

const router = createRouter({
    history: typeof window !== "undefined" ? createWebHistory() : createMemoryHistory(),
    routes: [
        ...homeRoutes, // Homepage routes ["/"]
        ...authenticationRoutes, // Authentication routes ["/login", "/register", "/forgot-password", "/reset-password"]
        ...joinRoutes, // Join routes ["/join", "/j/:id"]
        ...adminRoutes, // Admin routes ["/admin", "/admin/:page"]
        ...settingsRoutes, // Settings routes ["/admin/settings", "/admin/settings/:page"]
        ...helpRoutes, // Help routes ["/help", "/open"]
        ...requestRoutes, // Request routes ["/request"]
        ...setupRoutes, // Setup routes ["/setup", "/setup/:step"]
        ...docsRoutes, // Docs routes ["/docs", "/docs/:id"]
        ...coreRoutes, // Core routes ["/:pathMatch(.*)*"]
    ],
});

router.afterEach((to) => {
    const defaultTitle = ref("Wizarr");
    const titleRef = ref(to.meta.title as string | undefined);
    useTitle(computed(() => (titleRef.value !== undefined ? `${titleRef.value} | ${defaultTitle.value}` : defaultTitle.value)));
});

router.beforeEach(async (to, from, next) => {
    // Get the auth store and check if the user is authenticated
    const authStore = useAuthStore();
    var nextPage = next;

    // Start progress bar
    useProgressStore().startProgress();

    // Check if there exists a middleware to run
    if (to.meta.middleware) {
        // Determine the middleware pipeline as an array and create a context object
        const middleware = to.meta.middleware as any[];
        const context = { to, from, next, parameters: { authStore, router } };

        // Run the middleware pipeline
        nextPage = middleware[0]({
            ...context,
            next: middlewarePipeline(context, middleware, 1),
        });
    }

    return nextPage();
});

router.afterEach(() => {
    // Stop progress bar
    useProgressStore().startProgress();
});

export default router;
export { router };
