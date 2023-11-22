import { Service } from "typedi";
import { BaseRepository } from "./base.repository";
import { Server } from "../entities/server.entity";
import { FindOperator } from "typeorm";
import { Admins } from "../entities/admins.entity";

@Service()
class ServerRepository extends BaseRepository {
    readonly repository = this.db.getRepository(Server);

    async findAll() {
        return await this.db.getRepository(Admins).find();
        return await this.repository.find();
    }

    async findOneById(id: number | FindOperator<number>) {}
}

export default ServerRepository;
