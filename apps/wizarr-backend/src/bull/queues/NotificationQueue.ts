import { reddisConfig } from "../../config/bull";
import { Queue } from "bullmq";
import { NotificationWorkerData, NotificationWorkerResult } from "../workers/NotificationWorker";

const NotificationQueue = new Queue<NotificationWorkerData, NotificationWorkerResult>("notifications", {
    connection: reddisConfig(),
    defaultJobOptions: {
        removeOnComplete: process.env.NODE_ENV === "production",
        removeOnFail: process.env.NODE_ENV === "production",
    },
});

export default NotificationQueue;
