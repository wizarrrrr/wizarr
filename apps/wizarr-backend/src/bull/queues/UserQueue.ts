import { redis } from "../../config/redis";
import { Queue } from "bullmq";
import { UserWorkerData, UserWorkerResult } from "../workers/UserWorker";

const UserQueue = new Queue<UserWorkerData, UserWorkerResult>("user", {
    connection: redis,
});

export default UserQueue;
