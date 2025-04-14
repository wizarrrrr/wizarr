import { RepositoryBase } from "../BaseRepository";
import { SessionEntity } from "../../models/Account/SessionEntity";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";

@EntityRepository(SessionEntity)
export class SessionRepository extends RepositoryBase<SessionEntity> {}
