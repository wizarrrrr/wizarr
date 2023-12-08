import { Server } from "@/api/models/Server/ServerModel";
import { UserWorkerData } from "@/bull/workers/UserWorker";
import { connection } from "@/data-source";
import { Logger, LoggerInterface } from "@/decorators/LoggerDecorator";
import { BulkJobOptions, Queue } from "bullmq";
import Container from "typedi";

export const scanUsers = async (servers?: Server | Server[] | string | string[], queue?: Queue) => {
    // Define the servers array to scan
    let serversToScan: Server[] = [];
    let logger: LoggerInterface = Container.get("Logger");

    // Check if the servers are an array and is of type Server
    if (Array.isArray(servers) && servers[0] instanceof Server) {
        serversToScan = await connection.getRepository(Server).find({
            where: servers.map((s) => ({ id: (s as Server).id })),
        });
    }

    // Check if the servers are an array and is of type string
    if (Array.isArray(servers) && typeof servers[0] === "string") {
        serversToScan = await connection.getRepository(Server).find({
            where: servers.map((s) => ({ id: s as string })),
        });
    }

    // Check if the servers are a single server and is of type Server
    if (!Array.isArray(servers) && servers instanceof Server) {
        serversToScan = [servers];
    }

    // Check if the servers are a single server and is of type string
    if (!Array.isArray(servers) && typeof servers === "string") {
        serversToScan = await connection.getRepository(Server).find({
            where: [{ id: servers }],
        });
    }

    // Check if the servers are null
    if (serversToScan.length === 0 && !servers) {
        serversToScan = await connection.getRepository(Server).find();
    }

    logger.info(`Scanning ${serversToScan.length} servers for users`);

    // Create the jobs for the queue
    const jobs: Array<{ name: string; data: UserWorkerData; opts?: BulkJobOptions }> = serversToScan.map((server) => {
        return {
            name: `Scanning ${server.name} for users`,
            data: {
                server: server,
            },
            opts: {
                removeOnComplete: process.env.NODE_ENV === "production",
            },
        };
    });

    // Add the jobs to the queue
    const jobQueue = await queue.addBulk(jobs);

    // Return the job queue as JSON
    return jobQueue.map((job) => {
        const json: { [key: string]: any } = {};
        Object.entries(job).forEach(([key, value]) => {
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                json[key] = value;
            }
        });
        return json;
    });
};
