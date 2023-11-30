import { ServerLibrary } from "@/api/models/Server/ServerLibraryModel";
import { ServerLibraryRepository } from "@/api/repositories/Server/ServerLibraryRepository";
import { InjectRepository } from "@/decorators";
import { Service } from "typedi";

@Service()
export class ServerLibraryService {
    /**
     * Creates an instance of MediaServerService.
     * @param serverLibraryRepository
     * @constructor
     */
    constructor(@InjectRepository() private serverLibraryRepository: ServerLibraryRepository) {}

    /**
     * Gets all serverLibraries.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: Server[] }>}
     */
    public async getAll(resourceOptions?: object): Promise<{ total_data: number; rows: ServerLibrary[] }> {
        return await this.serverLibraryRepository.getManyAndCount(resourceOptions);
    }

    /**
     * Gets one serverLibrary by id.
     * @param {string} id
     * @param {object} resourceOptions
     * @returns {Promise<Server>}
     */
    public async findOneById(id: string, resourceOptions?: object): Promise<ServerLibrary> {
        return await this.getRequestdMediaServerLibraryOrFail(id, resourceOptions);
    }

    /**
     * Helper function to get a mediaServer by id or throw an exception.
     */
    private async getRequestdMediaServerLibraryOrFail(id: string, resourceOptions?: object) {
        const mediaServer = await this.serverLibraryRepository.getOneById(id as any, resourceOptions);
        if (!mediaServer) throw new Error(`MediaServer with id '${id}' not found`);
        return mediaServer;
    }
}
