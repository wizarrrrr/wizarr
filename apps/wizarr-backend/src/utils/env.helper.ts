import { config } from "dotenv";
import { access, constants } from "fs";
import { resolve } from "path";
import consola from "consola";

// Environment variable helper function
function env<T>(key: string, defaultValue?: T): T | undefined {
    return (process.env[key] as T) ?? defaultValue;
}

// Load environment variables from .env file
access(env("DOTENV_FILE", resolve(process.env.ROOT_PATH, ".env")), constants.F_OK, (error) => {
    if (error) {
        return consola.warn("Environment file not found. Using default environment variables.");
    }
    config({ path: env("DOTENV_FILE", resolve(process.env.ROOT_PATH, ".env")) });
});

// Assign env function to global scope
if (typeof globalThis !== "undefined") {
    (globalThis as any).env = env;
}

export function booleanConverter(value: string | boolean): boolean {
    if (typeof value === "boolean") {
        return value;
    }
    return ["true", "1", "yes", "y", "on", "enabled"].includes(value.toString().toLowerCase());
}

export function envOrFail(key: string): string | undefined {
    if (typeof process.env[key] === "undefined") {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key];
}
