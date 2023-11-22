import { SemVer } from "semver";

/**
 * @api {get} /version Get API version
 */
export interface Version {
    current_version: string;
    latest_version: string;
    latest_stable_version: string;
    latest_beta_version: string;
    is_beta: boolean;
    is_latest: boolean;
    version_info: Record<string, SemVer>;
}
