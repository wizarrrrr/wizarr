import { RepositoryBase } from "../BaseRepository";
import { UserEntity } from "../../models/Account/UserEntity";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";
import { Service } from "typedi";

@EntityRepository(UserEntity)
export class AdminRepository extends RepositoryBase<UserEntity> {}
