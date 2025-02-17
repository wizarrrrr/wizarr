import { Service } from "typedi";
import { Logger, LoggerInterface } from "../decorators/LoggerDecorator";

import UserQueue from "./queues/UserQueue";
import UserWorker from "./workers/UserWorker";

import NotificationQueue from "./queues/NotificationQueue";
import NotificationWorker from "./workers/NotificationWorker";

import LibraryQueue from "./queues/LibraryQueue";
import LibraryWorker from "./workers/LibraryWorker";
import consola from "consola";
import { bold } from "colors";

const queues = {
    user: UserQueue,
    notification: NotificationQueue,
    library: LibraryQueue,
};

const workers = {
    user: UserWorker,
    notification: NotificationWorker,
    library: LibraryWorker,
};

export type Queues = keyof typeof queues;
export type Workers = keyof typeof workers;

@Service()
export class BullMQ {
    /**
     * Create a new instance of the BullMQ class.
     */
    constructor(@Logger() private logger?: LoggerInterface) {}

    /**
     * BullMQ queues and workers.
     */
    public queues: typeof queues = queues;
    public workers: typeof workers = workers;

     /**
     * First letter uppercase.
     * @param str
     * @returns
     */
    private capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // /**
    //  * Generate a JSON list of queues and workers in the queues and workers folders.
    //  */
    // private async generateList() {
    //     // Get the queues and workers in the queues and workers folders.
    //     const queues = await fs.readdir(path.join(__dirname, "queues"), { withFileTypes: true });
    //     const workers = await fs.readdir(path.join(__dirname, "workers"), { withFileTypes: true });

    //     // Filter the files in the folders to only include .ts/.js files.
    //     const queueFiles = queues.filter((file) => (file.isFile() && file.name.endsWith(".ts")) || file.name.endsWith(".js"));
    //     const workerFiles = workers.filter((file) => (file.isFile() && file.name.endsWith(".ts")) || file.name.endsWith(".js"));

    //     return { queues: queueFiles, workers: workerFiles };
    // }

    // /**
    //  * Initialize BullMQ queues and workers and register them in the container.
    //  */
    // public async initialize() {
    //     // Generate the list of queues and workers.
    //     const list = await this.generateList();
    //     const errorList: Array<Error> = [];

    //     // Initialize the queues.
    //     for (const queueKey of list.queues) {
    //         try {
    //             const queueModule = await import(path.resolve(queueKey.parentPath, queueKey.name));
    //             const queueName = queueKey.name.split(".")[0].replace("Queue", "").toLowerCase() as keyof Queues;
    //             Object.defineProperty(this.queues, queueName, { value: queueModule.default as Queues[keyof Queues] });
    //             await this.queues[queueName].waitUntilReady();
    //             consola.success(`${bold(`${this.capitalize(queueName)} Queue`)} initialized in ${bold("BullMQ")}`);
    //         } catch (error) {
    //             consola.fail(`${bold(`${this.capitalize(queueKey.name.split(".")[0].replace("Queue", "").toLowerCase() as keyof Queues)} Queue`)} failed to initialize in ${bold("BullMQ")}`);
    //             errorList.push(error);
    //         }
    //     }

    //     // Initialize the workers.
    //     for (const workerKey of list.workers) {
    //         try {
    //             const workerModule = await import(path.resolve(workerKey.parentPath, workerKey.name));
    //             const workerName = workerKey.name.split(".")[0].replace("Worker", "").toLowerCase() as keyof Queues;
    //             Object.defineProperty(this.workers, workerName, { value: workerModule.default as Workers[keyof Workers] });
    //             await this.workers[workerName].waitUntilReady();
    //             consola.success(`${bold(`${this.capitalize(workerName)} Worker`)} initialized in ${bold("BullMQ")}`);
    //         } catch (error) {
    //             consola.fail(`${bold(`${this.capitalize(workerKey.name.split(".")[0].replace("Worker", "").toLowerCase() as keyof Workers)} Worker`)} failed to initialize in ${bold("BullMQ")}`);
    //             errorList.push(error);
    //         }
    //     }

    //     // Log all the errors that occured
    //     for (const error of errorList) {
    //         consola.error(error, "\n");
    //     }
    // }
    /**
     * Initialize BullMQ queues and workers and register them in the container.
     */
    async initialize() {
        // Initialize the queues.
        Object.values(this.queues).forEach(async (queue) => {
            await queue.waitUntilReady();
            consola.success(`${bold(`${this.capitalize(queue.name)} Queue`)} initialized in ${bold("BullMQ")}`);
        });

        // Initialize the workers.
        Object.values(this.workers).forEach(async (worker) => {
            await worker.waitUntilReady();
            consola.success(`${bold(`${this.capitalize(worker.name)} Worker`)} initialized in ${bold("BullMQ")}`);
        });
    }

    /**
     * Get a queue by name.
     */
    public getQueue<T, K extends keyof typeof queues>(name: K): (typeof queues)[K] {
        return this.queues[name];
    }

    /**
     * Get a worker by name.
     */
    public getWorker<T, K extends keyof typeof workers>(name: K): (typeof workers)[K] {
        return this.workers[name];
    }
}
