import { User } from "../../models/User/UserModel";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";
import { RepositoryBase } from "../BaseRepository";

@EntityRepository(User)
export class UserRepository extends RepositoryBase<User> {}
