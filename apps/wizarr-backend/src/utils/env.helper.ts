import * as dotenv from "dotenv";

import { databasePath } from "../config/paths";
import { resolve } from "path";

if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: env("DOTENV_FILE", resolve(databasePath, ".env")) });
}

export function env<T>(key: string, defaultValue?: T): T {
    return (process.env[key] as T) ?? defaultValue;
}

export function booleanConverter(value: string | boolean): boolean {
    if (typeof value === "boolean") {
        return value;
    }

    return value === "true" || value === "1" || value === "yes" || value === "y" || value === "on" || value === "enabled";
}

export function envOrFail(key: string): string {
    if (typeof process.env[key] === "undefined") {
        throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key];
}
