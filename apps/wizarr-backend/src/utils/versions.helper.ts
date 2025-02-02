import semver from "semver";
import fs from "fs";
import path from "path";
import { getLatestStableVersion as getLatestStableVersionGithub, getLatestBetaVersion as getLatestBetaVersionGithub } from "./github.helper";
import { tryCatchAsync } from "./catch.helper";
import { memcached } from "src/config/memcached";
import consola from "consola";

const ONE_HOUR = 3600; // Memcached TTL in seconds

// Regular expressions to match version formats
export const versionRegex = /v(\d+\.\d+\.\d+)/;
export const versionBetaRegex = /v(\d+\.\d+\.\d+-beta(?:\.\d+)?)/;

/**
 * Retrieves a value from the cache or fetches and stores it if not found.
 *
 * @param {string} key - The cache key.
 * @param {() => Promise<any>} fetchFunction - The function to fetch the data if not in cache.
 * @param {number} ttl - Time-to-live for the cached value in seconds.
 * @returns {Promise<any>} - The cached or fetched value.
 */
async function getFromCache(key: string, fetchFunction: () => Promise<any>, ttl: number): Promise<any> {
    try {
        const data = await new Promise<any>((resolve, reject) => {
            memcached.get(key, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (data) return data;

        const result = await fetchFunction();
        consola.log(`Fetched result for ${key}:`, result);

        const valueToCache = result ?? "Unknown Version";
        if (result === undefined) {
            consola.error(`Invalid data for ${key}, setting fallback value.`);
        }

        memcached.set(key, valueToCache, ttl, (err) => {
            if (err) consola.error(`Error setting cache for ${key}:`, err);
        });

        return valueToCache;
    } catch (error) {
        throw error;
    }
}

/**
 * Caches and retrieves the latest stable version.
 * @returns {Promise<string>} Latest stable version.
 */
export const cachedGetLatestStableVersion = async (): Promise<string> => getFromCache("latest_stable", getLatestStableVersionGithub, ONE_HOUR);

/**
 * Caches and retrieves the latest beta version.
 * @returns {Promise<string>} Latest beta version.
 */
export const cachedGetLatestBetaVersion = async (): Promise<string> => getFromCache("latest_beta", getLatestBetaVersionGithub, ONE_HOUR);

/**
 * Caches and retrieves the current version.
 * @returns {Promise<string>} Current version.
 */
export const cachedGetCurrentVersion = async (): Promise<string> => getFromCache("current_version", getCurrentVersion, ONE_HOUR / 2);

/**
 * Sorts an array of semantic version tags in ascending order.
 * @param {string[]} tags - Array of version tags.
 * @returns {Promise<string[]>} Sorted version tags.
 */
export async function sortSemverTags(tags: string[]): Promise<string[]> {
    return tags.sort((a, b) => {
        const aVersion = semver.clean(a);
        const bVersion = semver.clean(b);
        if (!aVersion) return -1;
        if (!bVersion) return 1;
        return semver.compare(aVersion, bVersion);
    });
}

/**
 * Compares two semantic versions.
 * @param {string} a - First version.
 * @param {string} b - Second version.
 * @returns {Promise<number>} Comparison result: -1 if a < b, 1 if a > b, 0 if equal.
 */
export async function compareVersions(a: string, b: string): Promise<number> {
    const aVersion = semver.clean(a);
    const bVersion = semver.clean(b);
    if (!aVersion) return -1;
    if (!bVersion) return 1;
    return semver.compare(aVersion, bVersion);
}

/**
 * Checks if the current version is the latest available version.
 * @returns {Promise<boolean>} True if the current version is the latest, false otherwise.
 */
export async function isLatest(): Promise<boolean> {
    const currentVersion = await getCurrentVersion();
    const latestVersion = await getLatestVersion();
    return await tryCatchAsync(
        async () => (await compareVersions(currentVersion, latestVersion)) === 0,
        async () => true,
    );
}

/**
 * Determines if the current version is a beta version.
 * @returns {Promise<boolean>} True if the current version is beta, false otherwise.
 */
export async function isBeta(): Promise<boolean> {
    const currentVersion = await getCurrentVersion();
    return versionBetaRegex.test(currentVersion);
}

/**
 * Determines if the current version is a stable release.
 * @returns {Promise<boolean>} True if the current version is stable, false otherwise.
 */
export async function isStable(): Promise<boolean> {
    const currentVersion = await getCurrentVersion();
    return versionRegex.test(currentVersion);
}

/**
 * Retrieves the latest version (stable or beta based on the current version type).
 * @returns {Promise<string>} Latest version.
 */
export async function getLatestVersion(): Promise<string> {
    return (await isBeta()) ? cachedGetLatestBetaVersion() : cachedGetLatestStableVersion();
}

/**
 * Retrieves the latest stable version.
 * @returns {Promise<string>} Latest stable version.
 */
export async function getLatestStableVersion(): Promise<string> {
    return await cachedGetLatestStableVersion();
}

/**
 * Retrieves the latest beta version.
 * @returns {Promise<string>} Latest beta version.
 */
export async function getLatestBetaVersion(): Promise<string> {
    return await cachedGetLatestBetaVersion();
}

/**
 * Retrieves the current version from the environment or package.json.
 * @returns {Promise<string>} Current version string.
 */
export async function getCurrentVersion(): Promise<string> {
    let version = "0.0.0";

    if (process.env.WIZARR_PACKAGE_VERSION) {
        version = process.env.WIZARR_PACKAGE_VERSION;
    }

    const pathsToCheck = [path.resolve(__dirname, "../../../../../", "package.json"), path.resolve(__dirname, "../../../../", "package.json")];

    for (const packagePath of pathsToCheck) {
        if (fs.existsSync(packagePath)) {
            version = require(packagePath).version;
            break;
        }
    }

    return "v" + version;
}
