import { SemVer } from "semver";

/**
 * @api {get} /version Get API version
 */
export interface Version {
    currentVersion: string;
    latestVersion: string;
    latestStableVersion: string;
    latestBetaVersion: string;
    isBeta: boolean;
    isLatest: boolean;
    versionInfo: Record<string, SemVer>;
}
