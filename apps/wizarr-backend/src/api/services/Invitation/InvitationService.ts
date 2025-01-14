import { Admin } from "../../models/Account/AdminModel";
import { Invitation } from "../../models/Invitation/InvitationModel";
import { InvitationRepository } from "../../repositories/Invitation/InvitationRepository";
import { InjectRepository } from "../../../decorators/InjectRepository";
import { Service } from "typedi";
import { plainToClass } from "class-transformer";
import { ServerLibraryRepository } from "../../repositories/Server/ServerLibraryRepository";
import { InvitationRequest } from "../../requests/Invitation/InvitationRequest";
import { In } from "typeorm";

@Service()
export class InvitationService {
    /**
     * Creates an instance of InvitationService.
     * @param {InvitationRepository} invitationRepository
     * @constructor
     */
    constructor(
        @InjectRepository() private invitationRepository: InvitationRepository,
        @InjectRepository() private serverLibraryRepository: ServerLibraryRepository,
    ) {}

    /**
     * Gets all invitations.
     * @param {object} resourceOptions
     * @returns {Promise<{ total_data: number, rows: Invitation[] }>}
     */
    public async getAll(resourceOptions?: object, currentUser?: Admin): Promise<{ total_data: number; rows: Invitation[] }> {
        return await this.invitationRepository.getManyAndCount(resourceOptions, {
            where: "admin.id = :adminId",
            parameters: {
                adminId: currentUser?.id,
            },
        });
    }

    /**
     * Gets one invitation.
     * @param {string} id
     * @param {object} resourceOptions
     * @returns {Promise<Invitation>}
     */
    public async findOneById(id: string, resourceOptions?: object, currentUser?: Admin): Promise<Invitation> {
        return await this.getRequestedInvitationOrFail(id, resourceOptions, currentUser);
    }

    /**
     * Creates a invitation.
     * @param data
     * @param currentUser
     * @returns {Promise<Invitation>}
     */
    public async create(data: InvitationRequest, currentUser: Admin): Promise<Invitation> {
        const invitation = plainToClass(Invitation, data);
        invitation.admin = currentUser;
        invitation.libraries = await this.serverLibraryRepository.getManyByIds(data.libraries);
        const newInvitation = await this.invitationRepository.save(invitation);
        return newInvitation;
    }

    /**
     * Updates a invitation.
     * @param {string} id
     * @param {object} data
     * @param {Admin} currentUser
     * @returns {Promise<Invitation>}
     */
    public async update(id: string, data: InvitationRequest, currentUser: Admin): Promise<Invitation> {
        const invitation = await this.getRequestedInvitationOrFail(id, undefined, currentUser);
        const newInvitation = plainToClass(Invitation, { ...invitation, ...data });
        newInvitation.admin = currentUser;
        newInvitation.libraries = await this.serverLibraryRepository.getManyByIds(data.libraries);
        return await this.invitationRepository.save(newInvitation);
    }

    /**
     * Deletes a invitation.
     * @param {string} id
     * @param {Admin} currentUser
     * @returns {Promise<Invitation>}
     */
    public async delete(id: string, currentUser: Admin): Promise<Invitation> {
        const invitation = await this.getRequestedInvitationOrFail(id, undefined, currentUser);
        return await this.invitationRepository.remove(invitation);
    }

    /**
     * Helper function to get a requested invitation or fail with an exception.
     */
    private async getRequestedInvitationOrFail(id: string, resourceOptions?: object, currentUser?: Admin) {
        const userQuery = currentUser ? { where: "admin.id = :adminId", parameters: { adminId: currentUser.id } } : undefined;
        const invitation = await this.invitationRepository.getOneById(id as any, resourceOptions, userQuery);
        if (!invitation) throw new Error("Invitation not found");
        return invitation;
    }
}
