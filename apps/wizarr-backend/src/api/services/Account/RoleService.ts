import { RoleNotFoundException } from "@/api/exceptions/RoleNotFoundException";
import { Role } from "@/api/models/Account/RoleModel";
import { RoleRepository } from "@/api/repositories/Account/RoleRepository";
import { InjectRepository } from "@/decorators";
import { Service } from "typedi";

@Service()
export class RoleService {
    /**
     * Creates an instance of RoleService.
     * @param roleRepository
     * @returns
     */
    constructor(@InjectRepository() private roleRepository: RoleRepository) {}

    /**
     * Gets all roles.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: Role[] }>}
     */
    public async getAll(resourceOptions?: object): Promise<{ total_data: number; rows: Role[] }> {
        return await this.roleRepository.getManyAndCount(resourceOptions);
    }

    /**
     * Gets one role.
     * @param {string} id
     * @param {object} resourceOptions
     * @returns {Promise<Role>}
     */
    public async findOneById(id: string, resourceOptions?: object): Promise<Role> {
        return await this.getRequestdRoleOrFail(id, resourceOptions);
    }

    /**
     * Helper function to get a role by id or throw an exception.
     */
    private async getRequestdRoleOrFail(id: string, resourceOptions?: object) {
        const role = await this.roleRepository.getOneById(id as any, resourceOptions);
        if (!role) throw new RoleNotFoundException(`Role with id '${id}' not found`);
        return role;
    }
}
