import { RepositoryBase } from "../BaseRepository";
import { Admin } from "../../models/Account/AdminModel";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";

@EntityRepository(Admin)
export class AdminRepository extends RepositoryBase<Admin> {}
