import { RepositoryBase } from "../base.repository";
import { Admin } from "@/api/models/Account/AdminModel";
import { EntityRepository } from "@/decorators/entity-repository.decorator";

@EntityRepository(Admin)
export class AdminRepository extends RepositoryBase<Admin> {}
