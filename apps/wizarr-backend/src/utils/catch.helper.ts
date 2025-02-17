// Try Catch Helper
export function tryCatch<T>(fn: () => T, fallback?: () => T): T {
    try {
        return fn();
    } catch (err) {
        if (fallback) {
            return fallback();
        }
        throw err;
    }
}

// Try Catch Async Helper
export async function tryCatchAsync<T>(fn: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (err) {
        if (fallback) {
            return await fallback();
        }
        throw err;
    }
}