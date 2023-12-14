import { Queue } from "bullmq";
import { LibraryWorkerData, LibraryWorkerResult } from "../workers/LibraryWorker";
import { reddisConfig } from "../../config/bull";

const LibraryQueue = new Queue<LibraryWorkerData, LibraryWorkerResult>("library", {
    connection: reddisConfig(),
});

export default LibraryQueue;
