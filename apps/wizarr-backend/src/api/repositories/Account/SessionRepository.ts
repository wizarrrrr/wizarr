import { RepositoryBase } from "../BaseRepository";
import { Session } from "../../models/Account/SessionsModel";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";

@EntityRepository(Session)
export class SessionRepository extends RepositoryBase<Session> {}
