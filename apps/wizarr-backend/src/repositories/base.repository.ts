import { DataSource } from "typeorm";
import { Connection } from "../data-source";

export class BaseRepository {
    readonly db: DataSource = Connection;
}
