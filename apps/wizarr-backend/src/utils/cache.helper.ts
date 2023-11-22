import nodeCache from "node-cache";

//  Time constants
//  These are not exact, but they are close enough for our purposes
export const ONE_MINUTE = 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const ONE_MONTH = ONE_WEEK * 4;
export const ONE_YEAR = ONE_MONTH * 12;

export const cache = (cache: nodeCache, fn: Function, key: string, ttl?: number) => {
    if (hasValue(cache, key)) {
        return getValue(cache, key);
    }
    const value = fn();
    setValue(cache, key, value, ttl);
    return value;
};

export const setValue = (cache: nodeCache, key: string, value: any, ttl?: number) => {
    cache.set(key, value, ttl);
    return value;
};

export const hasValue = (cache: nodeCache, key: string) => {
    return cache.has(key);
};

export const getValue = (cache: nodeCache, key: string) => {
    return cache.get(key);
};

export const versionCache = new nodeCache({ stdTTL: ONE_HOUR });
