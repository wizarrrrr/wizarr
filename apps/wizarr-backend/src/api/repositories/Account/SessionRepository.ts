import { RepositoryBase } from "../base.repository";
import { Session } from "@/api/models/Account/SessionsModel";
import { EntityRepository } from "@/decorators/entity-repository.decorator";

@EntityRepository(Session)
export class SessionRepository extends RepositoryBase<Session> {}
