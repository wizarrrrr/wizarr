import { RepositoryBase } from "../base.repository";
import { Server } from "@/api/models/Server/ServerModel";
import { EntityRepository } from "@/decorators/entity-repository.decorator";
import { connection as datasource } from "../../../data-source";
import { Service } from "typedi";

@Service()
@EntityRepository(Server)
export class ServerRepository extends RepositoryBase<Server> {
    public connection = datasource;
}
