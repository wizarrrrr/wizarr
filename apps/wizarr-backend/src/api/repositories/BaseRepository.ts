import { MainRepository } from "@wizarrrr/typeorm-simple-query-parser";
import { connection } from "../../data-source";

export abstract class RepositoryBase<T> extends MainRepository<T> {
    readonly connection = connection;
}
