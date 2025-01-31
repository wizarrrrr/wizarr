import { Service } from "typedi";
import { Logger, LoggerInterface } from "../decorators/LoggerDecorator";

import type UserQueue from "./queues/UserQueue";
import type UserWorker from "./workers/UserWorker";

import type NotificationQueue from "./queues/NotificationQueue";
import type NotificationWorker from "./workers/NotificationWorker";

import type LibraryQueue from "./queues/LibraryQueue";
import type LibraryWorker from "./workers/LibraryWorker";
import { bold } from "colors";
import fs from "fs/promises";
import path from "path";

export type Queues = {
    user: typeof UserQueue;
    notification: typeof NotificationQueue;
    library: typeof LibraryQueue;
};

export type Workers = {
    user: typeof UserWorker;
    notification: typeof NotificationWorker;
    library: typeof LibraryWorker;
};

@Service()
export class BullMQ {
    /**
     * Create a new instance of the BullMQ class.
     */
    constructor(@Logger() private console: LoggerInterface) {}

    /**
     * BullMQ queues and workers.
     */
    public queues: Record<keyof Queues, Queues[keyof Queues]> = {} as Record<keyof Queues, Queues[keyof Queues]>;
    public workers: Record<keyof Workers, Workers[keyof Workers]> = {} as Record<keyof Workers, Workers[keyof Workers]>;

    /**
     * First letter uppercase.
     * @param str
     * @returns
     */
    private capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Generate a JSON list of queues and workers in the queues and workers folders.
     */
    private async generateList() {
        // Get the queues and workers in the queues and workers folders.
        const queues = await fs.readdir(path.join(__dirname, "queues"), { withFileTypes: true });
        const workers = await fs.readdir(path.join(__dirname, "workers"), { withFileTypes: true });

        // Filter the files in the folders to only include .ts/.js files.
        const queueFiles = queues.filter((file) => (file.isFile() && file.name.endsWith(".ts")) || file.name.endsWith(".js"));
        const workerFiles = workers.filter((file) => (file.isFile() && file.name.endsWith(".ts")) || file.name.endsWith(".js"));

        return { queues: queueFiles, workers: workerFiles };
    }

    /**
     * Initialize BullMQ queues and workers and register them in the container.
     */
    public async initialize() {
        // Generate the list of queues and workers.
        const list = await this.generateList();
        const errorList: Array<Error> = [];

        // Initialize the queues.
        for (const queueKey of list.queues) {
            try {
                const queueModule = await import(path.resolve(queueKey.parentPath, queueKey.name));
                const queueName = queueKey.name.split(".")[0].replace("Queue", "").toLowerCase() as keyof Queues;
                this.queues[queueName] = queueModule.default as Queues[keyof Queues];
                await this.queues[queueName].waitUntilReady();
                this.console.success(`${bold(`${this.capitalize(queueName)} Queue`)} initialized in ${bold("BullMQ")}`);
            } catch (error) {
                this.console.fail(`${bold(`${this.capitalize(queueKey.name.split(".")[0].replace("Queue", "").toLowerCase() as keyof Queues)} Queue`)} failed to initialize in ${bold("BullMQ")}`);
                errorList.push(error);
            }
        }

        // Initialize the workers.
        for (const workerKey of list.workers) {
            try {
                const workerModule = await import(path.resolve(workerKey.parentPath, workerKey.name));
                const workerName = workerKey.name.split(".")[0].replace("Worker", "").toLowerCase() as keyof Queues;
                this.workers[workerName] = workerModule.default as Workers[keyof Workers];
                await this.workers[workerName].waitUntilReady();
                this.console.success(`${bold(`${this.capitalize(workerName)} Worker`)} initialized in ${bold("BullMQ")}`);
            } catch (error) {
                this.console.fail(`${bold(`${this.capitalize(workerKey.name.split(".")[0].replace("Worker", "").toLowerCase() as keyof Workers)} Worker`)} failed to initialize in ${bold("BullMQ")}`);
                errorList.push(error);
            }
        }

        // Log all the errors that occured
        for (const error of errorList) {
            this.console.error(error, "\n");
        }
    }

    /**
     * Get a queue by name.
     */
    public getQueue<T, K extends keyof Queues>(name: K) {
        return this.queues[name];
    }

    /**
     * Get a worker by name.
     */
    public getWorker<T, K extends keyof Workers>(name: K) {
        return this.workers[name];
    }
}
