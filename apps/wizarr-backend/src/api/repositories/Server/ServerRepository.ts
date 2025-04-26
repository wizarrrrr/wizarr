import { RepositoryBase } from "../BaseRepository";
import { Server } from "../../models/Server/ServerModel";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";
import { Service } from "typedi";
import { connection } from "../../../main";
import { DataSource } from "typeorm";

@Service()
@EntityRepository(Server)
export class ServerRepository extends RepositoryBase<Server> {
    public connection: DataSource = connection;
}
