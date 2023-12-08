import { Admin } from "@/api/models/Account/AdminModel";
import { User } from "@/api/models/User/UserModel";
import { ServerRepository } from "@/api/repositories/Server/ServerRepository";
import { UserRepository } from "@/api/repositories/User/UserRepository";
import { BullMQ } from "@/bull";
import { UserWorkerData } from "@/bull/workers/UserWorker";
import { InjectRepository } from "@/decorators";
import { InjectQueue } from "@/decorators/InjectQueue";
import { scanUsers } from "@/media/jobs";
import { BulkJobOptions } from "bullmq";
import { Inject, Service } from "typedi";

@Service()
export class UserService {
    /**
     * Create an instance of the UserService
     * @param {UserRepository} userRepository
     * @constructor
     */
    constructor(
        @InjectRepository() private userRepository: UserRepository,
        @InjectQueue("user") private userQueue: BullMQ["queues"]["user"],
    ) {}

    /**
     * Gets all users.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: User[] }>}
     */
    public async getAll(resourceOptions?: any, currentUser?: Admin): Promise<{ total_data: number; rows: User[] }> {
        return await this.userRepository.getManyAndCount(resourceOptions, {
            where: "server.admin.id = :adminId",
            parameters: {
                adminId: currentUser?.id,
            },
        });
    }

    /**
     * Scan for users.
     * @returns
     */
    public async scan(serverId?: string) {
        return await scanUsers(serverId, this.userQueue);
    }
}
