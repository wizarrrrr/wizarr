import { UserNotFoundException } from "../../exceptions/UserNotFoundException";
import { Admin } from "../../models/Account/AdminModel";
import { AdminRepository } from "../../repositories/Account/AdminRepository";
import { InjectRepository } from "../../../decorators/InjectRepository";
import { StripPassword } from "../../../decorators/StripPasswordDecorator";
import { Service } from "typedi";

@Service()
export class AdminService {
    /**
     * Creates an instance of AdminService.
     * @param adminRepository
     * @returns
     */
    constructor(@InjectRepository() private adminRepository: AdminRepository) {}

    /**
     * Gets all admins.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: Admin[] }>}
     */
    @StripPassword()
    public async getAll(resourceOptions?: object): Promise<{ total_data: number; rows: Admin[] }> {
        return await this.adminRepository.getManyAndCount(resourceOptions);
    }

    /**
     * Gets one admin.
     * @param {string} id
     * @param {object} resourceOptions
     * @returns {Promise<Admin>}
     */
    @StripPassword()
    public async findOneById(id: string, resourceOptions?: object): Promise<Admin> {
        return await this.getRequestdUserOrFail(id, resourceOptions);
    }

    /**
     * Helper function to get a user by id or throw an exception.
     */
    private async getRequestdUserOrFail(id: string, resourceOptions?: object) {
        const admin = await this.adminRepository.getOneById(id as any, resourceOptions);
        if (!admin) throw new UserNotFoundException(`User with id '${id}' not found`);
        return admin;
    }
}
