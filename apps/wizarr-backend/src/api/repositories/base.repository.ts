import { MainRepository } from "typeorm-simple-query-parser";
import { Connection } from "@/data-source";

export abstract class RepositoryBase<T> extends MainRepository<T> {
    readonly db = Connection;
}
