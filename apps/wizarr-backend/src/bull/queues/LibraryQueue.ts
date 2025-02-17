import { Queue } from "bullmq";
import { LibraryWorkerData, LibraryWorkerResult } from "../workers/LibraryWorker";
import { redis } from "../../config/redis";

const LibraryQueue = new Queue<LibraryWorkerData, LibraryWorkerResult>("library", {
    connection: redis,
});

export default LibraryQueue;
