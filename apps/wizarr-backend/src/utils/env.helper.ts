import { config } from "dotenv";
import { access, constants } from "fs";
import { resolve } from "path";
import consola from "consola";

// Register paths for application environment
const ROOT_PATH = process.env["ROOT_PATH"] ?? resolve(__dirname, "../../");
const DB_DIR = process.env["DB_DIR"] ?? resolve(__dirname, "../../../", "database");
const STORAGE_DIR = process.env["STORAGE_DIR"] ?? resolve(__dirname, "../../../", "storage");

// Environment variable helper function
function env<T>(key: string, defaultValue?: T): T | undefined {
    // Check if the environment variable is ROOT_PATH, DB_DIR, or STORAGE_DIR
    if (key === "ROOT_PATH" || key === "DB_DIR" || key === "STORAGE_DIR") {
        switch (key) {
            case "ROOT_PATH":
                return ROOT_PATH as T;
            case "DB_DIR":
                return DB_DIR as T;
            case "STORAGE_DIR":
                return STORAGE_DIR as T;
        }
    }

    return (process.env[key] as T) ?? defaultValue;
}

// Resolve .env file path once
const rootPath = process.env.ROOT_PATH || process.cwd();
const defaultEnvPath = resolve(rootPath, ".env");
const envFilePath = process.env.DOTENV_FILE || defaultEnvPath;

// Check file existence and load config
access(envFilePath, constants.F_OK, (error) => {
    if (error) {
        consola.warn("Environment file not found. Using default environment variables.");
        return;
    }

    config({ path: envFilePath });
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
