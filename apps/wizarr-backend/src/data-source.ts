import { DataSource } from "typeorm";
import { dbConfig } from "./config/db";

export const Connection = new DataSource(dbConfig);
