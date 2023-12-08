import "reflect-metadata";

import { InvalidServer } from "../../exceptions/InvalidServer";
import { Admin } from "../../models/Account/AdminModel";
import { Server } from "../../models/Server/ServerModel";
import { ServerRepository } from "../../repositories/Server/ServerRepository";
import { ServerRequest } from "../../requests/Server/ServerPostRequest";
import { InjectRepository } from "../../../decorators/InjectRepository";
import { verifyServerType } from "../../../utils/server.helper";
import { plainToClass } from "class-transformer";
import { Service } from "typedi";

@Service()
export class ServerService {
    /**
     * Creates an instance of serverService.
     * @param serverRepository
     * @constructor
     */
    // @InjectRepository() private serverRepository: ServerRepository;
    constructor(@InjectRepository() private serverRepository: ServerRepository) {}

    /**
     * Gets all servers.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: Server[] }>}
     */
    public async getAll(resourceOptions?: object, currentUser?: Admin): Promise<{ total_data: number; rows: Server[] }> {
        return await this.serverRepository.getManyAndCount(resourceOptions, {
            where: "adminId = :adminId",
            parameters: {
                adminId: currentUser?.id,
            },
        });
    }

    /**
     * Gets one server.
     * @param {string} id
     * @param {object} resourceOptions
     * @returns {Promise<Server>}
     */
    public async findOneById(id: string, resourceOptions?: object, currentUser?: Admin): Promise<Server> {
        return await this.getRequestedServerOrFail(id, resourceOptions, currentUser);
    }

    /**
     * Creates a server.
     * @returns {Promise<Server>}
     */
    public async create(data: ServerRequest, currentUser: Admin): Promise<Server> {
        if (!(await verifyServerType(data.host, data.type, data.apiKey))) throw new InvalidServer("Server could not be verified");
        const server = plainToClass(Server, data);
        server.admin = currentUser;
        return await this.serverRepository.save(server);
    }

    /**
     * Updates a server.
     * @param {string} id
     * @param {object} data
     * @returns {Promise<Server>}
     */
    public async update(id: string, data: object, currentUser: Admin): Promise<Server> {
        const server = await this.getRequestedServerOrFail(id, undefined, currentUser);
        Object.assign(server, data);
        return await this.serverRepository.save(server, data);
    }

    /**
     * Deletes a server.
     * @param {string} id
     * @returns {Promise<Server>}
     */
    public async delete(id: string, currentUser: Admin): Promise<Server> {
        const server = await this.getRequestedServerOrFail(id, undefined, currentUser);
        return await this.serverRepository.remove(server);
    }

    /**
     * Helper function to get a server by id or throw an exception.
     */
    private async getRequestedServerOrFail(id: string, resourceOptions?: object, currentUser?: Admin) {
        const userQuery = currentUser ? { where: "adminId = :adminId", parameters: { adminId: currentUser.id } } : undefined;
        const mediaServer = await this.serverRepository.getOneById(id as any, resourceOptions, userQuery);
        if (!mediaServer) throw new Error(`MediaServer with id '${id}' not found`);
        return mediaServer;
    }

    /**
     * Helper function to verify if a server exists and is online.
     */
}
