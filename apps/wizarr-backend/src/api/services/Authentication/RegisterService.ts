import { Admin } from "@/api/models/Account/AdminModel";
import { AdminRepository } from "@/api/repositories/Account/AdminRepository";
import { RoleRepository } from "@/api/repositories/Account/RoleRepository";
import { RegisterRequest } from "@/api/requests/Authentication/RegisterRequest";
import { InjectRepository } from "@/decorators/InjectRepository";
import { StripPassword } from "@/decorators/password-stripper.decorator";
import { plainToClass } from "class-transformer";
import { Service } from "typedi";

@Service()
export class RegisterService {
    /**
     * Creates an instance of RegisterService.
     * @param adminRepository
     * @returns
     */
    constructor(
        @InjectRepository() private adminRepository: AdminRepository,
        @InjectRepository() private roleRepository: RoleRepository,
    ) {}

    /**
     * Creates an instance of RegisterService.
     * @param containers
     * @returns
     */
    @StripPassword()
    public async register(data: RegisterRequest) {
        const admin = plainToClass(Admin, data);
        admin.roles = await this.roleRepository.getRolesByName(data.roles);
        return this.adminRepository.save(admin);
    }
}
