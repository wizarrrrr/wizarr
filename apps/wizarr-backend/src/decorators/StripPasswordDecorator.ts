/**
 * Decorator to strip password from response, no matter the depth of the password property
 * in the response object.
 */
export function StripPassword(): CallableFunction {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args);
            if (result instanceof Array) {
                return result.map((item) => {
                    return stripPassword(item);
                });
            } else {
                return stripPassword(result);
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
function stripPassword(object: any): any {
    if (object instanceof Array) {
        return object.map((item) => {
            return stripPassword(item);
        });
    } else if (object instanceof Object) {
        const keys = Object.keys(object);
        for (const key of keys) {
            if (key === "password") {
                delete object[key];
            } else {
                object[key] = stripPassword(object[key]);
            }
        }
        return object;
    } else {
        return object;
    }
}
