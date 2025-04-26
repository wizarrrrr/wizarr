import { MainRepository } from "@wizarrrrr/typeorm-simple-query-parser";
import { connection } from "../../main";

export abstract class RepositoryBase<T> extends MainRepository<T> {
    readonly connection = connection;
}
