import { RepositoryBase } from "../BaseRepository";
import { RoleEntity } from "../../models/Account/RoleEntity";
import { EntityRepository } from "../../../decorators/entity-repository.decorator";
import { plainToClass } from "class-transformer";

@EntityRepository(RoleEntity)
export class RoleRepository extends RepositoryBase<RoleEntity> {
    /**
     * Get roles by their names
     * @param {string | string[]} names
     * @returns {Promise<RoleEntity[]>}
     */
    public async getRolesByName(names: string | string[], remove?: boolean): Promise<RoleEntity[]> {
        // Get all roles from the database where the name is in the names array
        let roles = await this.getMany({
            where: {
                name: names,
            },
        });

        // If remove is true, remove the roles from the database that are not in the names array
        if (remove) roles = roles.filter((role) => names.includes(role.name));

        // For each role in the names array that is not in the database, create a new role class
        const newRoles = Array.isArray(names) ? names.filter((name) => !roles.find((role) => role.name === name)).map((name) => plainToClass(RoleEntity, { name })) : !roles.find((role) => role.name === names) ? [plainToClass(RoleEntity, { name: names })] : [];

        // Return the roles from the database and the new roles
        return [...roles, ...newRoles];
    }
}
