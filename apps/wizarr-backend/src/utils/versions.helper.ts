import semver from "semver";
import fs from "fs";

import { latestFile } from "../config/paths";
import { getLatestStableVersion as getLatestStableVersionGithub, getLatestBetaVersion as getLatestBetaVersionGithub } from "./github.helper";
import { cache, versionCache, ONE_HOUR } from "./cache.helper";
import { tryCatchAsync } from "./catch.helper";
import path from "path";

export const versionRegex = /v(\d+\.\d+\.\d+)/;
export const versionBetaRegex = /v(\d+\.\d+\.\d+-beta\.\d+)/;

export const cachedGetLatestStableVersion = async () => await cache(versionCache, getLatestStableVersionGithub, "latest_stable", ONE_HOUR);
export const cachedGetLatestBetaVersion = async () => await cache(versionCache, getLatestBetaVersionGithub, "latest_beta", ONE_HOUR);
export const cachedGetCurrentVersion = async () => await cache(versionCache, getCurrentVersion, "current_version", ONE_HOUR / 2);

export async function sortSemverTags(tags: string[]) {
    return tags.sort((a, b) => {
        const aVersion = semver.clean(a);
        const bVersion = semver.clean(b);
        if (!aVersion) return -1;
        if (!bVersion) return 1;
        return semver.compare(aVersion, bVersion);
    });
}

export async function compareVersions(a: string, b: string) {
    const aVersion = semver.clean(a);
    const bVersion = semver.clean(b);
    if (!aVersion) return -1;
    if (!bVersion) return 1;
    return semver.compare(aVersion, bVersion);
}

export async function isLatest(): Promise<boolean> {
    // Get the current version
    const currentVersion = await getCurrentVersion();

    // Get the latest version
    const latestVersion = await getLatestVersion();

    // Check if the current version is the latest version
    return await tryCatchAsync(async () => await compareVersions(currentVersion, latestVersion) === 0, async () => true);
}

export async function isBeta() {
    // Get the current version
    const currentVersion = await getCurrentVersion();

    // Check if the current version is a beta version
    return versionBetaRegex.test(currentVersion);
}

export async function isStable() {
    // Get the current version
    const currentVersion = await getCurrentVersion();

    // Check if the current version is a stable version
    return versionRegex.test(currentVersion);
}

export async function getLatestVersion() {
    // Check if the current version is a beta version
    if (await isBeta()) {
        // If it is, return the latest beta version
        return cachedGetLatestBetaVersion();
    }

    // If it isn't, return the latest stable version
    return cachedGetLatestStableVersion();
}

export async function getLatestStableVersion() {
    // Get the latest stable version
    const latestStableVersion = await cachedGetLatestStableVersion();

    // Return the latest stable version
    return latestStableVersion;
}

export async function getLatestBetaVersion() {
    // Get the latest beta version
    const latestBetaVersion = await cachedGetLatestBetaVersion();

    // Return the latest beta version
    return latestBetaVersion;
}

export async function getCurrentVersion(): Promise<string> {

    var version = "0.0.0";

    if (process.env.WIZARR_PACKAGE_VERSION) {
        version = process.env.WIZARR_PACKAGE_VERSION
    }

    if (fs.existsSync(path.resolve(__dirname, '../../../../../', 'package.json'))) {
        version = require(path.resolve(__dirname, '../../../../../', 'package.json')).version;
    }

    if (fs.existsSync(path.resolve(__dirname, '../../../../', 'package.json'))) {
        version = require(path.resolve(__dirname, '../../../../', 'package.json')).version;
    }
    
    // Return the version
    return "v" + version;
}
