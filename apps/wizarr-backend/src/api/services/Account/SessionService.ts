import { UserNotFoundException } from "@/api/exceptions/UserNotFoundException";
import { SessionRepository } from "@/api/repositories/Account/SessionRepository";
import { InjectRepository } from "@/decorators";
import { Session } from "@/api/models/Account/SessionsModel";
import { Service } from "typedi";
import { StripPassword } from "@/decorators/password-stripper.decorator";

@Service()
export class SessionService {
    /**
     * Creates an instance of SessionService.
     * @param sessionRepository
     * @returns
     */
    constructor(@InjectRepository() private sessionRepository: SessionRepository) {}

    /**
     * Gets all sessions.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: Admin[] }>}
     */
    @StripPassword()
    public async getAll(resourceOptions?: object): Promise<{ total_data: number; rows: Session[] }> {
        return await this.sessionRepository.getManyAndCount(resourceOptions);
    }

    /**
     * Gets one session.
     * @param {string} id
     * @param {object} resourceOptions
     * @returns {Promise<Admin>}
     */
    @StripPassword()
    public async findOneById(id: string, resourceOptions?: object): Promise<Session> {
        return await this.getRequestdSessionOrFail(id, resourceOptions);
    }

    /**
     * Helper function to get a user by id or throw an exception.
     */
    private async getRequestdSessionOrFail(id: string, resourceOptions?: object) {
        const admin = await this.sessionRepository.getOneById(id as any, resourceOptions);
        if (!admin) throw new UserNotFoundException(`Session with id '${id}' not found`);
        return admin;
    }
}
