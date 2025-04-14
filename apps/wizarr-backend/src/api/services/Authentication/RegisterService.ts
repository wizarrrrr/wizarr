import { UserEntity } from "../../models/Account/UserEntity";
import { AdminRepository } from "../../repositories/Account/AdminRepository";
import { RoleRepository } from "../../repositories/Account/RoleRepository";
import { RegisterRequest } from "../../requests/Authentication/RegisterRequest";
import { InjectRepository } from "../../../decorators/InjectRepository";
import { StripPassword } from "../../../decorators/StripPasswordDecorator";
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
        @InjectRepository() private roleRepository: RoleRepository,
        @InjectRepository() private adminRepository: AdminRepository,
    ) {}

    /**
     * Creates an instance of RegisterService.
     * @param containers
     * @returns
     */
    @StripPassword()
    public async register(data: RegisterRequest) {
        const admin = plainToClass(UserEntity, data);
        admin.roles = await this.roleRepository.getRolesByName(data.roles);
        admin.activated = (await this.adminRepository.count()) <= 0 ? true : false;
        return this.adminRepository.save(admin);
    }
}
