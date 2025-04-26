import { BullMQ } from "../bull";
import { Server } from "../api/models/Server/ServerModel";
import { UserWorkerData } from "../bull/workers/UserWorker";
import { connection } from "../main";
import { BulkJobOptions, Job, JobsOptions, Queue } from "bullmq";

import consola from "consola";

type ServerInput = Server | Server[] | string | string[];

const parseServers = async (servers?: ServerInput) => {
    // Define the servers array to scan
    let serversToScan: Server[] = [];

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

    return serversToScan;
};

const parseJob = (job: Job<any, any, string>[]) => {
    const json: { [key: string]: any } = {};
    Object.entries(job).forEach(([key, value]) => {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            json[key] = value;
        }
    });
    return json;
};

export const scanUsersJobs = async (servers?: ServerInput, options?: JobsOptions) => {
    // Define the servers array to scan
    let serversToScan: Server[] = await parseServers(servers);

    consola.info(`Scanning ${serversToScan.length} servers for users`);

    // Create the jobs for the queue
    const jobs: Array<{ name: string; data: UserWorkerData; opts?: JobsOptions }> = serversToScan.map((server) => {
        return {
            name: `Scanning ${server.name} for users`,
            data: {
                server: server,
            },
            opts: {
                removeOnComplete: process.env.NODE_ENV === "production",
                ...options,
            },
        };
    });

    // Return the jobs
    return jobs;
};

export const scanUsers = async (servers?: ServerInput, queue?: Queue, options?: BulkJobOptions) => {
    // Create the jobs for the queue
    const jobs = await scanUsersJobs(servers, options);

    // Add the jobs to the queue
    const jobQueue = await queue.addBulk(jobs);

    // Return the job queue as JSON
    return parseJob(jobQueue);
};

export const scanLibrariesJobs = async (servers?: ServerInput, options?: JobsOptions) => {
    // Define the servers array to scan
    let serversToScan: Server[] = await parseServers(servers);

    consola.info(`Scanning ${serversToScan.length} servers for libraries`);

    // Create the jobs for the queue
    const jobs: Array<{ name: string; data: UserWorkerData; opts?: JobsOptions }> = serversToScan.map((server) => {
        return {
            name: `Scanning ${server.name} for libraries`,
            data: {
                server: server,
            },
            opts: {
                removeOnComplete: process.env.NODE_ENV === "production",
                ...options,
            },
        };
    });

    // Return the jobs
    return jobs;
};

export const scanLibraries = async (servers?: ServerInput, queue?: BullMQ["queues"]["library"], options?: BulkJobOptions) => {
    // Create the jobs for the queue
    const jobs = await scanLibrariesJobs(servers, options);

    // Add the jobs to the queue
    const jobQueue = await queue.addBulk(jobs);

    // Return the job queue as JSON
    return parseJob(jobQueue);
};
