import { Invitation } from "../../models/Invitation/InvitationModel";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";
import { RepositoryBase } from "../BaseRepository";

@EntityRepository(Invitation)
export class InvitationRepository extends RepositoryBase<Invitation> {
    /**
     * Get invitations by their ids
     * @param {string[]} ids
     * @returns {Promise<Invitation[]>}
     */
    public async getInvitationsByIds(ids: string[]): Promise<Invitation[]> {
        return await this.getMany({
            where: {
                id: ids,
            },
        });
    }
}
