import { User } from "@/api/models/User/UserModel";
import { EntityRepository } from "@/decorators/entity-repository.decorator";
import { RepositoryBase } from "../base.repository";

@EntityRepository(User)
export class UserRepository extends RepositoryBase<User> {}
