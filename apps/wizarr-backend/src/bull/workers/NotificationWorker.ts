import { reddisConfig } from "@/config/bull";
import { Job, Worker } from "bullmq";

export interface Notifications {
    id: string;
    title: string;
    message: string;
    type: string;
    date: Date;
}

export type NotificationWorkerData = Partial<Notifications>;
export type NotificationWorkerResult = Notifications;

const NotificationWorkerHandler = async (job: Job<NotificationWorkerData, NotificationWorkerResult>) => {
    return {
        id: job.name,
        title: job.data.title,
        message: job.data.message,
        type: job.data.type || "info",
        date: new Date(),
    };
};

const NotificationWorker = new Worker("notifications", NotificationWorkerHandler, {
    connection: reddisConfig(),
    concurrency: 10,
});

export default NotificationWorker;
