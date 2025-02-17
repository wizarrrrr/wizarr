import { redis } from "../../config/redis";
import { Queue } from "bullmq";
import { NotificationWorkerData, NotificationWorkerResult } from "../workers/NotificationWorker";

const NotificationQueue = new Queue<NotificationWorkerData, NotificationWorkerResult>("notifications", {
    connection: redis,
    defaultJobOptions: {
        removeOnComplete: process.env.NODE_ENV === "production",
        removeOnFail: process.env.NODE_ENV === "production",
    },
});

export default NotificationQueue;
