import { Repository, TreeRepository, MongoRepository, EntityTarget, ObjectType } from "typeorm";
import { Constructable, Container } from "typedi";
import { connection } from "@/data-source";

/**
 * Helper to avoid V8 compilation of anonymous function on each call of decorator.
 */
function getRepositoryHelper(repositoryType: ObjectType<unknown>, entityType: EntityTarget<unknown>) {
    switch (repositoryType) {
        case Repository:
            return connection.getRepository(entityType);
        case MongoRepository:
            return connection.getMongoRepository(entityType);
        case TreeRepository:
            return connection.getTreeRepository(entityType);
        default:
            /** If the requested type is not well-known, then it must be a custom repository. */
            return connection.getCustomRepository(repositoryType);
    }
}

export function InjectRepository(): CallableFunction;
export function InjectRepository(entityType?: Function): CallableFunction {
    return (object: object, propertyName: string | symbol, index?: number): void => {
        let entityType: Function | undefined;
        let repositoryType: Function;

        if (Reflect?.getOwnMetadata == undefined) {
            throw new Error("Reflect.getOwnMetadata is not defined. Make sure to import the `reflect-metadata` package!");
        }

        if (index !== undefined) {
            /** The decorator has been applied to a constructor parameter. */
            const paramTypes: Function[] | undefined = Reflect.getOwnMetadata("design:paramtypes", object, propertyName);

            if (!paramTypes[index]) {
                throw new Error(`No type information found for parameter ${index} of ${object.constructor.name}`);
            }

            repositoryType = paramTypes[index];
        } else {
            /** The decorator has been applied to a class property. */
            const propertyType: Function | undefined = Reflect.getOwnMetadata("design:type", object, propertyName);

            if (!propertyType) {
                throw new Error(`No type information found for parameter ${index} of ${object.constructor.name}`);
            }

            repositoryType = propertyType;
        }

        switch (repositoryType) {
            case Repository:
            case MongoRepository:
            case TreeRepository:
                if (!entityType) {
                    throw new Error(`No entity type found for ${repositoryType.name}`);
                }
        }

        Container.registerHandler({
            object: object as Constructable<unknown>,
            index: index,
            propertyName: propertyName as string,
            value: (containerInstance) => getRepositoryHelper(repositoryType, entityType),
        });
    };
}
