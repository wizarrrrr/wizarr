import { RepositoryBase } from "./base.repository";
import { Server } from "@/api/models/ServerModel";
import { EntityRepository } from "@/decorators/entity-repository.decorator";

@EntityRepository(Server)
export class ServerRepository extends RepositoryBase<Server> {
    // readonly repository = this.db.getRepository(Server);
    // async findAll() {
    //     return await this.repository.find();
    // }
    // async findOneById(id: number | FindOperator<number>) {}
}
