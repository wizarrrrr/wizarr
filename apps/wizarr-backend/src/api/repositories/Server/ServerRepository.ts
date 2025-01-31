import { RepositoryBase } from "../BaseRepository";
import { Server } from "../../models/Server/ServerModel";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";
import { connection as datasource } from "../../../config/connection";
import { Service } from "typedi";

@Service()
@EntityRepository(Server)
export class ServerRepository extends RepositoryBase<Server> {
    public connection = datasource;
}
