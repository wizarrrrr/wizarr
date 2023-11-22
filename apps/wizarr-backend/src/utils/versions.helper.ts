import semver from "semver";
import fs from "fs";

import { latestFile } from "../configs/paths";
import { getLatestStableVersion as getLatestStableVersionGithub, getLatestBetaVersion as getLatestBetaVersionGithub } from "./github.helper";
import { cache, versionCache, ONE_HOUR } from "./cache.helper";

export const versionRegex = /v(\d+\.\d+\.\d+)/;
export const versionBetaRegex = /v(\d+\.\d+\.\d+-beta\.\d+)/;

export const cachedGetLatestStableVersion = () => cache(versionCache, getLatestStableVersionGithub, "latest_stable", ONE_HOUR);
export const cachedGetLatestBetaVersion = () => cache(versionCache, getLatestBetaVersionGithub, "latest_beta", ONE_HOUR);
export const cachedGetCurrentVersion = () => cache(versionCache, getCurrentVersion, "current_version", ONE_HOUR / 2);

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
    return (await compareVersions(currentVersion, latestVersion)) === 0;
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
    // Check if the latest file exists
    if (!fs.existsSync(latestFile)) {
        // If it doesn't, return the current version
        return process.env.npm_package_version || "0.0.0";
    }

    // Read the first line of the latest file
    const version = fs.readFileSync(latestFile, "utf8").split("\n")[0];

    // Return the version
    return "v" + version || "0.0.0";
}
