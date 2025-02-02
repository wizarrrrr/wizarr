import consola from "consola";
import { memcached } from "src/config/memcached";

/**
 * Caches the result of a method using Memcached.
 *
 * @param {number | string} args - Either TTL (number) followed by cache key (string), or just a cache key.
 * @returns {MethodDecorator} - The decorator function.
 */
export function Cached(...args: [number, string] | [string] | []): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
        const originalMethod = descriptor.value;
        // Ensure ttl is a number and cacheKey is a string
        const [ttl, cacheKey]: [number, string] = typeof args[0] === "number" ? [args[0], args[1] ?? `${target.constructor.name}.${propertyKey}`] : [3600, args[0] ?? `${target.constructor.name}.${propertyKey}`];
        descriptor.value = function (...methodArgs: any[]): Promise<any> {
            return new Promise((resolve, reject) => {
                memcached.get(cacheKey, (err, cacheValue) => {
                    if (err) {
                        consola.error(`Memcached get error for ${cacheKey}:`, err);
                        return reject(err);
                    }

                    if (cacheValue !== undefined) {
                        try {
                            return resolve(JSON.parse(cacheValue));
                        } catch (parseErr) {
                            consola.error(`Error parsing cached data for ${cacheKey}:`, parseErr);
                            return reject(parseErr);
                        }
                    }

                    // Execute the original method if cache miss
                    Promise.resolve(originalMethod.apply(this, methodArgs))
                        .then((result) => {
                            memcached.set(cacheKey, JSON.stringify(result), ttl, (setErr) => {
                                if (setErr) consola.error(`Error setting cache for ${cacheKey}:`, setErr);
                            });
                            consola.success(`Cached result for ${cacheKey}`);
                            resolve(result);
                        })
                        .catch(reject);
                });
            });
        };
    };
}
