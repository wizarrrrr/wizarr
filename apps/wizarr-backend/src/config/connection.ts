import { ColumnOptions, DataSource } from "typeorm";
import { database } from "./database";

export const config = database(env("DB_TYPE", "sqlite") as "sqlite" | "postgres");
export const connection = new DataSource(config);

export const DateTimeNow: ColumnOptions = {
    type: (config.type as string) === "sqlite" ? "datetime" : "timestamp",
    default: () => ((config.type as string) === "sqlite" ? "CURRENT_TIMESTAMP" : "now()"),
};

export const DateTime: ColumnOptions = {
    type: (config.type as string) === "sqlite" ? "datetime" : "timestamp",
};

export const DateTimeType = (config.type as string) === "sqlite" ? "datetime" : "timestamp";
