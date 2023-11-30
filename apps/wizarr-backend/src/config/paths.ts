import path from "path";

export const rootPath = process.env.ROOT_PATH ?? path.resolve(__dirname, "../", "../");
export const latestFile = process.env.LATEST_FILE ?? path.resolve(rootPath, "../", "../", "latest");
export const databasePath = process.env.DATABASE_DIR ?? path.resolve(rootPath, "../", "../", "database");
