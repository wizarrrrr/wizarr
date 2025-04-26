import { resolve } from "path";
import { toLowerCase } from "../utils/lowercase.helper";

import type { DataSourceOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const databaseFile = resolve(env("DB_DIR"), "wizarr.db");
const entityPath = resolve(__dirname, "../", "api", "models");
const migrationPath = resolve(__dirname, "../", "database", "migrations");

const entityFiles = resolve(entityPath, "**", "*.{js,ts}");
const migrationFiles = resolve(migrationPath, "**", "*.{js,ts}");

export const database = (type: "sqlite" | "postgres", options?: Partial<DataSourceOptions>): DataSourceOptions => {
    const opts: Partial<DataSourceOptions> = {
        type: toLowerCase(type),
        entities: options?.entities || [entityFiles],
        migrations: options?.migrations || [migrationFiles],
        migrationsRun: options?.migrationsRun || true,
        synchronize: options?.synchronize || env("DB_SYNCHRONIZE", "true").toLowerCase() === "true",
        logging: options?.logging || env("DB_LOGGING", "false").toLowerCase() === "true",
        cache: options?.cache || {
            type: "redis",
            duration: 30000,
            options: {
                socket: {
                    host: env("REDIS_HOST", "localhost"),
                    port: env("REDIS_PORT", 6379),
                },
            },
            ignoreErrors: true,
        },
    };

    if (opts.type === "sqlite" && env("DB_FILE", databaseFile)) {
        Object.assign(opts, {
            database: options?.database || env("DB_FILE", databaseFile),
        });
    }

    if ((opts.type === "postgres" && env("DB_URL")) || env("DB_HOST")) {
        const postgresOptions = options as PostgresConnectionOptions;
        Object.assign(opts, {
            url: postgresOptions?.url || env("DB_URL"),
            host: postgresOptions?.host || env("DB_HOST", "localhost"),
            port: postgresOptions?.port || env("DB_PORT", 5432),
            username: postgresOptions?.username || env("DB_USERNAME", "postgres"),
            password: postgresOptions?.password || env("DB_PASSWORD", "postgres"),
        });
    }

    return opts as DataSourceOptions;
};
