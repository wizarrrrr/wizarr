import { Server } from "../../api/models/Server/ServerModel";
import { User } from "../../api/models/User/UserModel";
import { redis } from "../../config/redis";
import { connection } from "../../config/connection";
import { getUsers } from "../../media/index";
import { AxiosProgressEvent } from "axios";
import { Job, Worker } from "bullmq";
import { nanoid } from "nanoid";
import { FindOneOptions } from "typeorm";
import NotificationQueue from "../queues/NotificationQueue";

export interface UserWorkerData {
    server: Server;
}

export interface UserWorkerResult {
    users: User[];
}

const UserWorkerHandler = async (job: Job<UserWorkerData, UserWorkerResult>) => {
    try {
        // Log the start of the job
        job.log(`Starting job for server ${job.data.server.id}`);

        // Progress tracker for Axios
        const onDownloadProgress = (progressEvent: AxiosProgressEvent) => {
            const progress = (progressEvent.progress ?? 0) * 80; // Ensure progressEvent.progress is not undefined
            job.updateProgress(progress);
        };

        // Fetch users from the server
        const users = await getUsers(job.data.server, {
            onDownloadProgress,
            timeout: 360_000, // 6 minutes timeout
        });

        if (!users || users.length === 0) {
            job.log(`No users found for server ${job.data.server.id}, finishing job`);
            return;
        }

        job.log(`Found ${users.length} users`);

        // Retrieve the server from the database
        const serverRepository = connection.getRepository(Server);
        const server = await serverRepository.findOneOrFail({
            where: { id: job.data.server.id },
        });

        job.log(`Saving ${users.length} users to the database for server ${server.id}`);

        // Save the users to the server
        server.users = users;
        await server.save();

        job.updateProgress(100);

        return { users };
    } catch (error) {
        job.log(`Job failed: ${error.message}`);
        await job.moveToFailed(error, nanoid());
        throw error; // Re-throw to ensure Worker emits a "failed" event
    }
};

// Create the Worker
const UserWorker = new Worker("user", UserWorkerHandler, {
    connection: redis,
    concurrency: 1,
});

// Notify on completion
UserWorker.on("completed", (job) => {
    NotificationQueue.add(nanoid(), {
        title: "Scan Complete",
        message: `${job.data.server.name} user scan has completed`,
        type: "success",
    });
});

// Log job failures
UserWorker.on("failed", (job, err) => {
    console.error(`${job.data.server.name} user scan failed: ${err.message}`);
    NotificationQueue.add(nanoid(), {
        title: "Scan Failed",
        message: `${job.data.server.name} user scan has failed`,
        type: "error",
    });
});

export default UserWorker;
