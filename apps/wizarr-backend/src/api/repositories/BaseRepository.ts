import { MainRepository } from "@wizarrrrr/typeorm-simple-query-parser";
import { connection } from "../../config/connection";

export abstract class RepositoryBase<T> extends MainRepository<T> {
    readonly connection = connection;
}
