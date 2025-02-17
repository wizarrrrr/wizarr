import type { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router";

/**
 * Middleware context interface
 * - to: RouteLocationNormalizedGeneric
 * - from: RouteLocationNormalizedLoadedGeneric
 * - next: NavigationGuardNext
 * - parameters: T
 */
interface MiddlewareContext<T> {
    to: RouteLocationNormalizedGeneric;
    from: RouteLocationNormalizedLoadedGeneric;
    next: NavigationGuardNext;
    parameters: T;
}

type MiddlewareFunction<T> = (context: MiddlewareContext<T>) => void;

export default function middlewarePipeline<T>(context: MiddlewareContext<T>, middleware: MiddlewareFunction<T>[], index: number = 0) {
    const nextMiddleware = middleware[index];

    if (!nextMiddleware) {
        return context.next;
    }

    return () => {
        const nextPipeline = middlewarePipeline(context, middleware, index + 1);
        nextMiddleware({ ...context, next: nextPipeline });
    };
}
