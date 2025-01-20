/**
 * Decorator to strip password from response, no matter the depth of the password property
 * in the response object.
 */
export function StripApiKey(): CallableFunction {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args);
            if (result instanceof Array) {
                return result.map((item) => {
                    return stripApiKey(item);
                });
            } else {
                return stripApiKey(result);
            }
        };
        return descriptor;
    };
}

/**
 * Strips the password from the given object.
 * @param {object} object
 * @returns {object}
 */
function stripApiKey(object: any): any {
    if (object instanceof Array) {
        return object.map((item) => {
            return stripApiKey(item);
        });
    } else if (object instanceof Object) {
        const keys = Object.keys(object);
        for (const key of keys) {
            if (key === "apiKey") {
                delete object[key];
            } else {
                object[key] = stripApiKey(object[key]);
            }
        }
        return object;
    } else {
        return object;
    }
}
