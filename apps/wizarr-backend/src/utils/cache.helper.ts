import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import nodeCache from "node-cache";
import app from "../main";

/**
 * Constants for time conversions
 */
export const ONE_MINUTE = 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const ONE_MONTH = ONE_WEEK * 4;
export const ONE_YEAR = ONE_MONTH * 12;

/**
 * readJsonFile - Reads a file from disk safely or returns an empty object if it fails
 * @param path The path to read the file from
 * @returns The file contents or an empty object
 */
export const readJSONFile = (path: string, encoding: BufferEncoding) => {
    if (existsSync(path)) return JSON.parse(readFileSync(path, encoding)) || {};
};

/**
 * persistCache - Persists the cache to disk so it can be loaded later
 * @param cache The cache to persist
 * @param path The path to persist the cache to
 * @returns The cache that was persisted
 */
export const persistCache = (cache: nodeCache, path: string) => {
    // Read the file from disk if it exists
    const file = readJSONFile(path, "utf8");
    // Merge the cache with the file
    const mergedCache = { ...file, ...cache.data };
    // Write the cache to disk
    writeFileSync(path, JSON.stringify(mergedCache, null, 4), "utf8");
};

/**
 * restoreCache - Restores the cache from disk so it can be used
 * @param cache The cache to restore
 * @param path The path to restore the cache from
 * @returns The cache that was restored
 */
export const restoreCache = (cache: nodeCache, path: string) => {
    // Read the file from disk if it exists
    const file = readJSONFile(path, "utf8");
    // Merge the cache with the file
    const mergedCache = { ...cache.data, ...file };
    // Write the cache to disk
    cache.data = mergedCache;
};

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
    // Log that the cache was updated
    app.log.info(`Updated cache for '${key}'` + (ttl ? ` with a TTL of '${ttl}'` : ""));
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
    cache.set(key, value, ttl || ONE_HOUR);
    persistCache(cache, resolve(env("DATABASE_DIR"), "cacheon"));
    return value;
};

/**
 * hasValue - Checks if the cache has a value for the specified key
 * @param cache The cache to use
 * @param key The key to check for
 * @returns True if the cache has a value for the specified key, false otherwise
 */
export const hasValue = (cache: nodeCache, key: string) => {
    restoreCache(cache, resolve(env("DATABASE_DIR"), "cacheon"));
    return cache.has(key);
};

/**
 * getValue - Gets a value from the cache
 * @param cache The cache to use
 * @param key The key to get the value for
 * @returns The value for the specified key
 */
export const getValue = (cache: nodeCache, key: string) => {
    restoreCache(cache, resolve(env("DATABASE_DIR"), "cacheon"));
    return cache.get(key);
};

export const versionCache = new nodeCache({ stdTTL: ONE_HOUR });
export const secretCache = new nodeCache({ stdTTL: ONE_HOUR / 2 });
export const githubCache = new nodeCache({ stdTTL: ONE_DAY });
