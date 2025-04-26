import { resolve } from "path";

process.env.DB_DIR = env("DB_DIR", resolve(process.env.ROOT_PATH, "database"));
