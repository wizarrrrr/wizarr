import path from "path";

export const rootPath = process.env.ROOT_PATH || path.resolve(__dirname, "../", "../");
export const latestFile = path.resolve(rootPath, "../", "../", "../", "../", "../", "latest");
export const databasePath = path.resolve(rootPath, "../", "../", "../", "../", "../", "database");
