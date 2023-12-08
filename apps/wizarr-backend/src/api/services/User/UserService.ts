import { Admin } from "@/api/models/Account/AdminModel";
import { User } from "@/api/models/User/UserModel";
import { UserRepository } from "@/api/repositories/User/UserRepository";
import { InjectRepository } from "@/decorators";
import { Service } from "typedi";

@Service()
export class UserService {
    /**
     * Create an instance of the UserService
     * @param {UserRepository} userRepository
     * @constructor
     */
    constructor(@InjectRepository() private userRepository: UserRepository) {}

    /**
     * Gets all users.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: User[] }>}
     */
    public async getAll(resourceOptions?: any, currentUser?: Admin): Promise<{ total_data: number; rows: User[] }> {
        return await this.userRepository.getManyAndCount(resourceOptions, {
            where: "server.adminId = :adminId",
            parameters: {
                adminId: currentUser?.id,
            },
        });
    }
}
