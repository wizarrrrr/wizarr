import { ColumnOptions } from "typeorm";
import { database } from "./database";
import { resolve } from "path";

export const configSQLite = database("sqlite", {
    database: resolve(process.env.DB_DIR, "config.db"),
    entities: [resolve(__dirname, "models", "**", "*.{js,ts}")],
    synchronize: true,
    migrationsRun: true,
    logging: true,
});

export const config = database(env("DB_TYPE", "sqlite") as "sqlite" | "postgres");

export const DateTimeNow: ColumnOptions = {
    type: (config.type as string) === "sqlite" ? "datetime" : "timestamp",
    default: () => ((config.type as string) === "sqlite" ? "CURRENT_TIMESTAMP" : "now()"),
};

export const DateTime: ColumnOptions = {
    type: (config.type as string) === "sqlite" ? "datetime" : "timestamp",
};

export const DateTimeType = (config.type as string) === "sqlite" ? "datetime" : "timestamp";
