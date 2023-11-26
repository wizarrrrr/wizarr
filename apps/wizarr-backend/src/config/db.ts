import type { DataSourceOptions } from "typeorm";
import { databasePath } from "./paths";
import { resolve } from "path";

const dbFile = resolve(databasePath, "wizarr.db");
const entityPath = resolve(__dirname, "../", "api", "models");
const migrationPath = resolve(__dirname, "../", "database", "migrations");

const entityFiles = resolve(entityPath, "**", "*.{js,ts}");
const migrationFiles = resolve(migrationPath, "**", "*.{js,ts}");

export const dbConfig: DataSourceOptions = {
    type: "sqlite",
    database: dbFile,
    entities: [entityFiles],
    migrations: [migrationFiles],
    migrationsRun: true,
    synchronize: true,
    logging: false,
};
