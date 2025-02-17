import { redis } from "../../config/redis";
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
    try {
        // Validate required fields
        if (!job.data.title || !job.data.message) {
            throw new Error("Missing required notification data: 'title' and 'message' are mandatory.");
        }

        // Construct the notification result
        const notification: Notifications = {
            id: job.name, // Use the job name as the notification ID
            title: job.data.title,
            message: job.data.message,
            type: job.data.type || "info", // Default to "info" type if not provided
            date: new Date(),
        };

        return notification;
    } catch (error) {
        job.log(`Failed to process notification: ${error.message}`);
        throw error; // Ensure the worker emits a "failed" event
    }
};

const NotificationWorker = new Worker("notifications", NotificationWorkerHandler, {
    connection: redis,
    concurrency: 10, // Handle up to 10 jobs concurrently
});

NotificationWorker.on("completed", (job) => {
    console.log(`Notification job completed: ${job.id}`);
});

NotificationWorker.on("failed", (job, err) => {
    console.error(`Notification job failed: ${job?.id}, Error: ${err.message}`);
});

export default NotificationWorker;
