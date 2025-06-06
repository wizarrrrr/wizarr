import Container, { Constructable } from "typedi";
import type { ConsolaInstance } from "consola";

export function Logger(): CallableFunction {
    return function (object: Object, propertyName: string, index?: number) {
        Container.registerHandler({
            object: object as Constructable<unknown>,
            index: index,
            propertyName: propertyName,
            value: (containerInstance) => {
                return containerInstance.get("Logger");
            },
        });
    };
}

export type LoggerInterface = ConsolaInstance;
