import { Admin } from "@/api/models/AdminModel";
import { Role } from "@/api/models/RoleModel";
import { AdminRepository } from "@/api/repositories/AdminRepository";
import { InjectRepository } from "@/decorators";
import { Service } from "typedi";

@Service()
export class RegisterService {
    /**
     * Creates an instance of RegisterService.
     * @param adminRepository
     * @returns
     */
    constructor(@InjectRepository() private adminRepository: AdminRepository) {}

    /**
     * Creates an instance of RegisterService.
     * @param containers
     * @returns
     */
    public async register(): Promise<void> {
        const admin = new Admin();
        admin.name = "Ashley Bailey";
        admin.username = "test";
        admin.email = "test@wizarr.dev";
        admin.password = "admin";
        // admin.addRoles("admin");

        // const role = new Role();
        // role.name = "admin";
        const role = await Role.findOne({ where: { name: "admin" } });

        admin.roles = [role];

        await this.adminRepository.save(admin);
    }
}
