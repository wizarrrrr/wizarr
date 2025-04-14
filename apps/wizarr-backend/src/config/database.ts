import { resolve } from "path";
import { toLowerCase } from "../utils/lowercase.helper";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import type { DataSourceOptions } from "typeorm";

const entityPath = resolve(__dirname, "../", "api", "models");
const migrationPath = resolve(__dirname, "../", "database", "migrations");

const entityFiles = resolve(entityPath, "**", "*.{js,ts}");
const migrationFiles = resolve(migrationPath, "**", "*.{js,ts}");

const DB_HOST = env("DB_HOST", "localhost");
const DB_PORT = env("DB_PORT", 5432);
const DB_USERNAME = env("DB_USERNAME", "postgres");
const DB_PASSWORD = env("DB_PASSWORD", "postgres");
const DB_NAME = env("DB_NAME", "postgres");

const DB_URL = env("DB_URL", null);
const DB_FILE = env("DB_FILE", `${env("DB_DIR")}/${env("DB_FILE", "wizarr.db")}`);

export const database = (type: "sqlite" | "postgres"): DataSourceOptions => {
    const options: Partial<DataSourceOptions> = {
        type: toLowerCase(type),
        namingStrategy: new SnakeNamingStrategy(),
        entities: [entityFiles],
        migrations: [migrationFiles],
        migrationsRun: true,
        synchronize: true,
        logging: false,
        cache: {
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

    if (options.type === "sqlite" && DB_FILE) {
        Object.assign(options, {
            database: DB_FILE,
        });
    }

    if (options.type === "postgres" && (DB_URL || DB_HOST)) {
        Object.assign(options, {
            url: DB_URL || undefined,
            host: DB_HOST || undefined,
            port: DB_PORT || undefined,
            username: DB_USERNAME || undefined,
            password: DB_PASSWORD || undefined,
        });
    }

    return options as DataSourceOptions;
};
