import { resolve } from "path";

console.log(process.env.DB_DIR);
console.log(process.env.ROOT_PATH);
process.env.DB_DIR = env("DB_DIR", resolve(process.env.ROOT_PATH, "database"));

// Set environment variables for the application
