import { resolve } from "path";
import { toLowerCase } from "../utils/lowercase.helper";

import type { DataSourceOptions } from "typeorm";

const databaseFile = resolve(env("DATABASE_DIR"), "wizarr.db");
const entityPath = resolve(__dirname, "../", "api", "models");
const migrationPath = resolve(__dirname, "../", "database", "migrations");

const entityFiles = resolve(entityPath, "**", "*.{js,ts}");
const migrationFiles = resolve(migrationPath, "**", "*.{js,ts}");

export const database = (type: "sqlite" | "postgres"): DataSourceOptions => {
    const options: Partial<DataSourceOptions> = {
        type: toLowerCase(type),
        entities: [entityFiles],
        migrations: [migrationFiles],
        migrationsRun: true,
        synchronize: true,
        logging: false,
        // cache: {
        //     type: "redis",
        //     duration: 30000,
        //     options: {
        //         socket: {
        //             host: env("REDIS_HOST", "localhost"),
        //             port: env("REDIS_PORT", 6379),
        //         },
        //     },
        //     ignoreErrors: true,
        // },
    };

    if (options.type === "sqlite" && env("DATABASE_FILE", databaseFile)) {
        Object.assign(options, {
            database: env("DATABASE_FILE", databaseFile),
        });
    }

    if ((options.type === "postgres" && env("DB_URL")) || env("DB_HOST")) {
        Object.assign(options, {
            url: env("DB_URL"),
            host: env("DB_HOST"),
            port: env("DB_PORT", 5432),
            username: env("DB_USERNAME"),
            password: env("DB_PASSWORD"),
        });
    }

    return options as DataSourceOptions;
};
