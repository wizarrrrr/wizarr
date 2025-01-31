import { resolve } from "path";

console.log(process.env.DATABASE_DIR);
console.log(process.env.ROOT_PATH);
process.env.DATABASE_DIR = env("DATABASE_DIR", resolve(process.env.ROOT_PATH, "database"));

// Set environment variables for the application
