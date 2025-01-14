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
import { scanLibraries, scanUsers } from "../../../media/jobs";
import { InjectQueue } from "../../../decorators/InjectQueue";
import { BullMQ } from "../../../bull";

@Service()
export class ServerService {
    /**
     * Creates an instance of serverService.
     * @param serverRepository
     * @constructor
     */
    // @InjectRepository() private serverRepository: ServerRepository;
    constructor(
        @InjectRepository() private serverRepository: ServerRepository,
        @InjectQueue("user") private userQueue: BullMQ["queues"]["user"],
        @InjectQueue("library") private libraryQueue: BullMQ["queues"]["library"],
    ) {}

    /**
     * Gets all servers.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: Server[] }>}
     */
    public async getAll(resourceOptions?: object, currentUser?: Admin): Promise<{ total_data: number; rows: Server[] }> {
        return await this.serverRepository.getManyAndCount(resourceOptions, {
            where: "admin.id = :adminId",
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
     * @param {object} data
     * @param {Admin} currentUser
     * @returns {Promise<Server>}
     */
    public async create(data: any, currentUser: Admin): Promise<Server> {
        if (!(await verifyServerType(data.host, data.type, data.apiKey))) throw new InvalidServer("Server could not be verified");
        const server = plainToClass(Server, data);
        server.admin = currentUser;
        const newServer = await this.serverRepository.save(server);
        await scanLibraries(newServer.id, this.libraryQueue);
        await scanUsers(newServer.id, this.userQueue);
        return newServer;
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
        server.users = [];
        server.libraries = [];
        await server.save();
        return await this.serverRepository.remove(server);
    }

    /**
     * Helper function to get a server by id or throw an exception.
     */
    private async getRequestedServerOrFail(id: string, resourceOptions?: object, currentUser?: Admin) {
        const userQuery = currentUser ? { where: "admin.id = :adminId", parameters: { adminId: currentUser.id } } : undefined;
        const mediaServer = await this.serverRepository.getOneById(id as any, resourceOptions, userQuery);
        if (!mediaServer) throw new Error(`MediaServer with id '${id}' not found`);
        return mediaServer;
    }
}
