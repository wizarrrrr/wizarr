import { Server } from "@/api/models/Server/ServerModel";
import { User } from "@/api/models/User/UserModel";
import { reddisConfig } from "@/config/bull";
import { connection } from "@/data-source";
import { getUsers } from "@/media";
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
    // Log the start of the job
    job.log(`Starting job for server ${job.data.server.id}`);

    // Progress tracker for axios
    const onDownloadProgress = (progressEvent: AxiosProgressEvent) => {
        const progress = progressEvent.progress * 100 * 0.8;
        job.updateProgress(progress);
    };

    // Get the users from the server
    const users = await getUsers(job.data.server, {
        onDownloadProgress: onDownloadProgress,
        timeout: 360000, // 6 minutes timeout
    }).catch((error) => job.moveToFailed(error, nanoid()));

    // If the users are null, return
    if (!users) return;

    // If the users are empty, return
    if (users.length === 0) {
        job.log(`No users found for server ${job.data.server.id}, finishing job`);
        return;
    }

    // Log the total number of users
    job.log(`Found ${users.length} users`);

    // Get the server from the database
    const serverRepository = connection.getRepository(Server);

    // Find query for servers
    const query: FindOneOptions<Server> = {
        where: { id: job.data.server.id },
    };

    // Save the users to the database
    const server = await serverRepository.findOneOrFail(query).catch((error) => job.moveToFailed(error, nanoid()));

    // If the server is null, return
    if (!server) return;

    // Log saving the users to the database
    job.log(`Saving ${users.length} users to the database for server ${server.id}`);

    // Save the users to the server
    server.users = users;
    server.save();

    // Update the progress to 100%
    job.updateProgress(100);

    // Return the users
    return { users: users };
};

const UserWorker = new Worker("user", UserWorkerHandler, {
    connection: reddisConfig(),
});

UserWorker.on("completed", (job) => {
    NotificationQueue.add(nanoid(), {
        title: "Users scanned",
        message: `Scanned ${job.data.server.name} for users`,
        type: "success",
    });
});

export default UserWorker;
