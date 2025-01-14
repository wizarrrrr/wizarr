import { Admin } from "../../models/Account/AdminModel";
import { User } from "../../models/User/UserModel";
import { UserRepository } from "../../repositories/User/UserRepository";
import { BullMQ } from "../../../bull";
import { InjectRepository } from "../../../decorators/InjectRepository";
import { InjectQueue } from "../../../decorators/InjectQueue";
import { scanUsers } from "../../../media/jobs";
import { Service } from "typedi";

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
