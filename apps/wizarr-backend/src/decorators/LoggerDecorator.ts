import Container, { Constructable } from "typedi";
import { CustomLogger } from "types/koa";
import { Logger } from "pino";

export function Logger(): CallableFunction {
    return function (object: Object, propertyName: string, index?: number) {
        Container.registerHandler({
            object: object as Constructable<unknown>,
            index: index,
            propertyName: propertyName,
            value: (containerInstance) => {
                return containerInstance.get("logger");
            },
        });
    };
}

export type LoggerInterface = CustomLogger & Logger;
