import { connection } from "../data-source";
import { Container, Constructable, ContainerInstance } from "typedi";

/**
 * Injects a TypeORM connection into the decorated property.
 * @returns
 */
export function InjectConnection(): CallableFunction {
    return function (target: Object, propertyKey: string | symbol, index?: number): void {
        console.log("InjectConnection", target, propertyKey, index);
        Container.registerHandler({
            object: target as Constructable<unknown>,
            index: index,
            propertyName: propertyKey as string,
            value: (containerInstance: ContainerInstance) => {
                return connection;
            },
        });
    };
}
