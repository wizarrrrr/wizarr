import { EntitySchema, getMetadataArgsStorage } from "typeorm";
import { EntityRepositoryMetadataArgs } from "typeorm/metadata-args/EntityRepositoryMetadataArgs";

export function EntityRepository(entity?: Function | EntitySchema<any>): ClassDecorator {
    return function (target: Function) {
        getMetadataArgsStorage().entityRepositories.push({
            target: target,
            entity: entity,
        } as EntityRepositoryMetadataArgs);
    };
}
