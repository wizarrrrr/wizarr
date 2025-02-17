import Container, { Constructable } from "typedi";
import { BullMQ, Queues } from "../bull";

/**
 * Injects BullMQ queue into a class property or constructor parameter.
 * @param queueName The name of the queue to inject.
 */
export function InjectQueue(queueName?: Queues): CallableFunction {
    return (object: object, propertyName: string, index?: number): void => {
        Container.registerHandler({
            object: object as Constructable<unknown>,
            index: index,
            propertyName: propertyName,
            value: (containerInstance) => {
                const bullMQ = containerInstance.get(BullMQ);
                return bullMQ.getQueue(queueName);
            },
        });
    };
}

/**
 * Injects BullMQ worker into a class property or constructor parameter.
 * @param workerName The name of the worker to inject.
 */
export function InjectWorker(workerName?: Queues): CallableFunction {
    return (object: object, propertyName: string, index?: number): void => {
        Container.registerHandler({
            object: object as Constructable<unknown>,
            index: index,
            propertyName: propertyName,
            value: (containerInstance) => {
                const bullMQ = containerInstance.get(BullMQ);
                return bullMQ.getWorker(workerName);
            },
        });
    };
}
