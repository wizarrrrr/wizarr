import consola from "consola";
import { connection } from "../config/connection";
import { Container, Constructable, ContainerInstance } from "typedi";

/**
 * Injects a TypeORM connection into the decorated property.
 * @returns
 */
export function InjectConnection(): CallableFunction {
    return function (target: Object, propertyKey: string | symbol, index?: number): void {
        consola.log("InjectConnection", target, propertyKey, index);
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
