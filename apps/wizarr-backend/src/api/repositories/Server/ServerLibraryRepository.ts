import { ServerLibrary } from "../../models/Server/ServerLibraryModel";
import { RepositoryBase } from "../BaseRepository";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";
import { In } from "typeorm";

@EntityRepository(ServerLibrary)
export class ServerLibraryRepository extends RepositoryBase<ServerLibrary> {
    /**
     * Get server libraries by their ids
     * @param {string[]} ids
     * @returns {Promise<ServerLibrary[]>}
     */
    public async getManyByIds(ids: string[]): Promise<ServerLibrary[]> {
        return await this.find({
            where: {
                id: In(ids),
            },
        });
    }
}
