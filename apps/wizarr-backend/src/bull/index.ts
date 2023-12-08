import { Inject, Service } from "typedi";
import { Logger, LoggerInterface } from "@/decorators/LoggerDecorator";

import UserQueue from "./queues/UserQueue";
import UserWorker from "./workers/UserWorker";
import NotificationQueue from "./queues/NotificationQueue";
import NotificationWorker from "./workers/NotificationWorker";

const queues = {
    user: UserQueue,
    notifications: NotificationQueue,
};

const workers = {
    user: UserWorker,
    notifications: NotificationWorker,
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
     * Initialize BullMQ queues and workers and register them in the container.
     */
    async initialize() {
        // Initialize the queues.
        Object.values(this.queues).forEach(async (queue) => {
            await queue.waitUntilReady();
            this.logger?.info(`Initializing for ${queue.name} queue completed`);
        });

        // Initialize the workers.
        Object.values(this.workers).forEach(async (worker) => {
            await worker.waitUntilReady();
            this.logger?.info(`Initializing for ${worker.name} worker completed`);
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
