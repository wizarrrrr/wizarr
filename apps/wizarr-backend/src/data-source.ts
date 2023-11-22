import { DataSource } from "typeorm";
import { databasePath } from "./configs/paths";
import { resolve } from "path";

export const Connection = new DataSource({
    type: "sqlite",
    database: resolve(databasePath, "wizarr.db"),
    entities: [resolve(__dirname, "entities", "*.entity.{ts,js}")],
    migrations: [resolve(__dirname, "migrations", "*.{ts,js}")],
    migrationsRun: true,
    synchronize: true,
    logging: true,
});
