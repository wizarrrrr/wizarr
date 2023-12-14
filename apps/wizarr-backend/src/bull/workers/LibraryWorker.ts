import { Server } from "../../api/models/Server/ServerModel";
import { ServerLibrary } from "../../api/models/Server/ServerLibraryModel";
import { reddisConfig } from "../../config/bull";
import { Job, Worker } from "bullmq";
import { AxiosProgressEvent } from "axios";
import { nanoid } from "nanoid";
import { getLibraries } from "../../media/index";
import { connection } from "../../data-source";
import NotificationQueue from "../queues/NotificationQueue";

export interface LibraryWorkerData {
    server: Server;
}

export interface LibraryWorkerResult {
    libraries: ServerLibrary[];
}

const LibraryWorkerHandler = async (job: Job<LibraryWorkerData, LibraryWorkerResult>) => {
    // Log the start of the job
    job.log(`Starting library scan job for server ${job.data.server.id}`);

    // Progress tracker for axios
    const onDownloadProgress = (progressEvent: AxiosProgressEvent) => {
        const progress = progressEvent.progress * 100 * 0.8;
        job.updateProgress(progress);
    };

    // Get the libraries from the server
    const libraries = await getLibraries(job.data.server, {
        onDownloadProgress: onDownloadProgress,
        timeout: 360000, // 6 minutes timeout
    }).catch((error) => job.moveToFailed(error, nanoid()));

    // If the libraries are null, return
    if (!libraries) return;

    // If the libraries are empty, return
    if (libraries.length === 0) {
        job.log(`No libraries found for server ${job.data.server.id}, finishing job`);
        return;
    }

    // Log each library name
    libraries.forEach((library) => job.log(`Found library ${library.name}`));

    // Log the total number of libraries
    job.log(`Found ${libraries.length} libraries`);

    // Get the server from the database
    const serverRepository = connection.getRepository(Server);

    // Find query for servers
    const query = {
        where: { id: job.data.server.id },
    };

    // Save the libraries to the database
    // const server = await serverRepository.findOneOrFail(query).catch((error) => job.moveToFailed(error, nanoid()));
    const server = await serverRepository.findOneBy({
        id: job.data.server.id,
    });

    // If the server is null, return
    if (!server) return;

    // Log saving the libraries to the database
    job.log(`Saving ${libraries.length} libraries to the database for server ${job.data.server.id}`);

    // Save the libraries to the database
    server.libraries = libraries;
    server.save();

    // Update the progress to 100%
    job.updateProgress(100);

    // Return the libraries
    return { libraries: libraries };
};

const LibraryWorker = new Worker("library", LibraryWorkerHandler, {
    connection: reddisConfig(),
    concurrency: 1,
});

LibraryWorker.on("completed", (job) => {
    NotificationQueue.add(nanoid(), {
        title: "Library scan complete",
        message: `Library scan for server ${job.data.server.name} completed`,
        type: "success",
    });
});

export default LibraryWorker;
