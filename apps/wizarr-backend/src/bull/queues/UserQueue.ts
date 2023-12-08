import { reddisConfig } from "@/config/bull";
import { Queue } from "bullmq";
import { UserWorkerData, UserWorkerResult } from "../workers/UserWorker";

const UserQueue = new Queue<UserWorkerData, UserWorkerResult>("user", {
    connection: reddisConfig(),
});

export default UserQueue;
