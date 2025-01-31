import { Repository, TreeRepository, MongoRepository, EntityTarget, ObjectType, getMetadataArgsStorage, ObjectLiteral } from "typeorm";
import { Constructable, Container } from "typedi";
import { connection } from "../config/connection";

/**
 * Custom repository fetcher, because TypeORM deprecated the old way of doing it.
 * @param customRepository The custom repository to fetch.
 * @returns The custom repository instance.
 */
function getCustomRepository<T>(customRepository: ObjectType<T> | EntityTarget<T>): T {
    const entityRepositoryMetadataArgs = getMetadataArgsStorage().entityRepositories.find((repository) => {
        return repository.target === (typeof customRepository === "function" ? customRepository : customRepository.constructor);
    });

    if (!entityRepositoryMetadataArgs) throw Error("No metadata args found for the given custom repository.");

    const entityMetadata = entityRepositoryMetadataArgs.entity ? connection.getMetadata(entityRepositoryMetadataArgs.entity) : undefined;
    // @ts-ignore
    let entityRepositoryInstance = new entityRepositoryMetadataArgs.target(this, entityMetadata);

    if (!entityMetadata) throw Error("No entity metadata found for the given custom repository.");

    Object.defineProperty(entityRepositoryInstance, "metadata", {
        value: entityMetadata,
        writable: true, // Set to true if you want to allow changes to the property
        enumerable: true,
        configurable: true,
    });

    Object.defineProperty(entityRepositoryInstance, "manager", {
        value: connection.createEntityManager(),
        writable: true, // Set to true if you want to allow changes to the property
        enumerable: true,
        configurable: true,
    });

    return entityRepositoryInstance;
}

/**
 * Repository fetcher, that can fetch any type of repository.
 * @param repositoryType The repository type to fetch.
 * @param entityType The entity type to fetch.
 */
function getRepositoryHelper<T>(repositoryType: ObjectType<T>, entityType?: EntityTarget<ObjectLiteral>) {
    switch (repositoryType) {
        case Repository:
            return connection.getRepository(entityType);
        case MongoRepository:
            return connection.getMongoRepository(entityType);
        case TreeRepository:
            return connection.getTreeRepository(entityType);
        default:
            /** If the requested type is not well-known, then it must be a custom repository. */
            return getCustomRepository(repositoryType);
    }
}

/**
 * Injects a repository into a class property or constructor parameter.
 * @param entityType The entity type to inject.
 */
// export function InjectRepository(): CallableFunction;
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

            if (!paramTypes) {
                throw new Error(`No type information found for parameter ${index} of ${object.constructor.name}`);
            }

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
            value: () => getRepositoryHelper(repositoryType, entityType),
        });
    };
}
