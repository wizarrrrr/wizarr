import { Server } from "../../api/models/Server/ServerModel";
import { ServerLibrary } from "../../api/models/Server/ServerLibraryModel";
import { redis } from "../../config/redis";
import { Job, Worker } from "bullmq";
import { AxiosProgressEvent } from "axios";
import { nanoid } from "nanoid";
import { getLibraries } from "../../media/index";
import { connection } from "../../config/connection";
import NotificationQueue from "../queues/NotificationQueue";

export interface LibraryWorkerData {
    server: Server;
}

export interface LibraryWorkerResult {
    libraries: ServerLibrary[];
}

const LibraryWorkerHandler = async (job: Job<LibraryWorkerData, LibraryWorkerResult>) => {
    try {
        job.log(`Starting library scan job for server ${job.data.server.id}`);

        // Progress tracker for Axios
        const onDownloadProgress = (progressEvent: AxiosProgressEvent) => {
            const progress = (progressEvent.progress ?? 0) * 80; // Ensure progressEvent.progress is not undefined
            job.updateProgress(progress);
        };

        // Fetch libraries from the server
        const libraries = await getLibraries(job.data.server, {
            onDownloadProgress,
            timeout: 360_000, // 6 minutes timeout
        });

        if (!libraries || libraries.length === 0) {
            job.log(`No libraries found for server ${job.data.server.id}`);
            return;
        }

        libraries.forEach((library) => job.log(`Found library: ${library.name}`));
        job.log(`Total libraries found: ${libraries.length}`);

        // Retrieve the server from the database
        const serverRepository = connection.getRepository(Server);
        const server = await serverRepository.findOneBy({ id: job.data.server.id });

        if (!server) {
            job.log(`Server with ID ${job.data.server.id} not found in the database`);
            return;
        }

        // Save the libraries to the server
        job.log(`Saving ${libraries.length} libraries to the database for server ${server.id}`);
        server.libraries = libraries;
        await server.save();

        job.updateProgress(100);
        return { libraries };
    } catch (error) {
        job.log(`Library scan job failed: ${error.message}`);
        await job.moveToFailed(error, nanoid());
        throw error; // Re-throw to emit "failed" event
    }
};

const LibraryWorker = new Worker("library", LibraryWorkerHandler, {
    connection: redis,
    concurrency: 1, // Limit concurrency to ensure one job is processed at a time
});

// Notification on job completion
LibraryWorker.on("completed", (job) => {
    NotificationQueue.add(nanoid(), {
        title: "Library Scan Complete",
        message: `Library scan for server ${job.data.server.name} completed successfully.`,
        type: "success",
    });
});

// Log job failures
LibraryWorker.on("failed", (job, err) => {
    console.error(`Library scan job failed: ${job?.id}, Error: ${err.message}`);
});

export default LibraryWorker;
