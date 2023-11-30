import { Server } from "@/api/models/Server/ServerModel";
import { ServerRepository } from "@/api/repositories/Server/ServerRepository";
import { ServerRequest } from "@/api/requests/Server/ServerPostRequest";
import { InjectRepository } from "@/decorators";
import { plainToClass } from "class-transformer";
import { Service } from "typedi";

@Service()
export class ServerService {
    /**
     * Creates an instance of MediaServerService.
     * @param mediaServerRepository
     * @constructor
     */
    constructor(@InjectRepository() private mediaServerRepository: ServerRepository) {}

    /**
     * Gets all mediaServers.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: Server[] }>}
     */
    public async getAll(resourceOptions?: object): Promise<{ total_data: number; rows: Server[] }> {
        return await this.mediaServerRepository.getManyAndCount(resourceOptions);
    }

    /**
     * Gets one mediaServer.
     * @param {string} id
     * @param {object} resourceOptions
     * @returns {Promise<Server>}
     */
    public async findOneById(id: string, resourceOptions?: object): Promise<Server> {
        return await this.getRequestdMediaServerOrFail(id, resourceOptions);
    }

    /**
     * Creates a mediaServer.
     * @returns {Promise<Server>}
     */
    public async create(data: ServerRequest): Promise<Server> {
        const server = plainToClass(Server, data);
        return await this.mediaServerRepository.save(server);
    }

    /**
     * Updates a mediaServer.
     * @param {string} id
     * @param {object} data
     * @returns {Promise<Server>}
     */
    public async update(id: string, data: object): Promise<Server> {
        const server = await this.getRequestdMediaServerOrFail(id);
        Object.assign(server, data);
        return await this.mediaServerRepository.save(server, data);
    }

    /**
     * Deletes a mediaServer.
     * @param {string} id
     * @returns {Promise<Server>}
     */
    public async delete(id: string): Promise<Server> {
        const server = await this.getRequestdMediaServerOrFail(id);
        return await this.mediaServerRepository.remove(server);
    }

    /**
     * Helper function to get a mediaServer by id or throw an exception.
     */
    private async getRequestdMediaServerOrFail(id: string, resourceOptions?: object) {
        const mediaServer = await this.mediaServerRepository.getOneById(id as any, resourceOptions);
        if (!mediaServer) throw new Error(`MediaServer with id '${id}' not found`);
        return mediaServer;
    }
}
