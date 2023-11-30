import { RepositoryBase } from "../base.repository";
import { Server } from "@/api/models/Server/ServerModel";
import { EntityRepository } from "@/decorators/entity-repository.decorator";

@EntityRepository(Server)
export class ServerRepository extends RepositoryBase<Server> {}
