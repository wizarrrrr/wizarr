import Container, { Constructable } from "typedi";
import { BullMQ, Queues, Workers } from "../bull";

/**
 * Injects BullMQ queue into a class property or constructor parameter.
 * @param queueName The name of the queue to inject.
 */
export function InjectQueue(queueName?: keyof Queues): ParameterDecorator {
    return (object: object, propertyName: string, index?: number): void => {
        Container.registerHandler({
            object: object as Constructable<unknown>,
            index: index,
            propertyName: propertyName,
            value: async (containerInstance) => {
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
export function InjectWorker(workerName?: keyof Workers): CallableFunction {
    return (object: object, propertyName: string, index?: number): void => {
        Container.registerHandler({
            object: object as Constructable<unknown>,
            index: index,
            propertyName: propertyName,
            value: async (containerInstance) => {
                const bullMQ = containerInstance.get(BullMQ);
                return bullMQ.getWorker(workerName);
            },
        });
    };
}
