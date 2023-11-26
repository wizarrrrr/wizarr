import nodeCache from "node-cache";

//  Time constants
//  These are not exact, but they are close enough for our purposes
export const ONE_MINUTE = 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const ONE_MONTH = ONE_WEEK * 4;
export const ONE_YEAR = ONE_MONTH * 12;

/**
 * cache - A function that caches the result of a function
 * @param cache The cache to use
 * @param fn The function to cache
 * @param key The key to cache the result under
 * @param ttl The time to live for the cache (optional)
 * @returns The result of the function
 */
export const cache = async (cache: nodeCache, fn: Function, key: string, ttl?: number) => {
    // Check if the cache has the value, if it does, return it
    if (hasValue(cache, key)) return getValue(cache, key);
    // If it doesn't, get the value
    const value = await fn();
    // Set the value in the cache
    setValue(cache, key, value, ttl);
    // Return the value
    return value;
};

/**
 * setValue - Sets a value in the cache
 * @param cache The cache to use
 * @param key The key to cache the value under
 * @param value The value to cache
 * @param ttl The time to live for the cache (optional)
 * @returns The value that was set
 */
export const setValue = (cache: nodeCache, key: string, value: any, ttl?: number) => {
    cache.set(key, value, ttl);
    return value;
};

/**
 * hasValue - Checks if the cache has a value for the specified key
 * @param cache The cache to use
 * @param key The key to check for
 * @returns True if the cache has a value for the specified key, false otherwise
 */
export const hasValue = (cache: nodeCache, key: string) => {
    return cache.has(key);
};

/**
 * getValue - Gets a value from the cache
 * @param cache The cache to use
 * @param key The key to get the value for
 * @returns The value for the specified key
 */
export const getValue = (cache: nodeCache, key: string) => {
    return cache.get(key);
};

export const versionCache = new nodeCache({ stdTTL: ONE_HOUR });
export const secretCache = new nodeCache({ stdTTL: ONE_HOUR / 2 });
