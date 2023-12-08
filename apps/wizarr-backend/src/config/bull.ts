import { env } from "@/utils/env.helper";
import { ConnectionOptions } from "bullmq";

export const reddisConfig = (): ConnectionOptions => {
    return {
        host: env("REDIS_HOST", "localhost"),
        port: env("REDIS_PORT", 6379),
        username: env("REDIS_USERNAME", undefined),
        password: env("REDIS_PASSWORD", undefined),
    };
};
