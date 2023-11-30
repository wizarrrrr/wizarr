import { Octokit } from "octokit";
import { sortSemverTags, versionBetaRegex } from "./versions.helper";
import { ONE_DAY, cache, githubCache } from "./cache.helper";
import { env } from "./env.helper";

const auth = env("GITHUB_TOKEN");
const octokit = new Octokit({ auth: auth });

const repo = "wizarr";
const owner = "wizarrrr";

export const cachedGetDescription = async () => await cache(githubCache, getDescription, "description", ONE_DAY);
export const cachedGetLicense = async () => await cache(githubCache, getLicense, "license", ONE_DAY);

/**
 * getLatestStableVersion - Gets the latest stable version of Wizarr
 * @returns {Promise<string>} The current version of Wizarr
 */
export const getLatestStableVersion = async (): Promise<string> => {
    try {
        // Retrieve all tags for the repo
        const response = await octokit.rest.repos.listTags({ owner, repo });
        // Filter out any tags that are beta versions
        const tags = response.data.filter((tag) => !versionBetaRegex.test(tag.name));
        // Sort the tags by version number
        const sortedTags = await sortSemverTags(tags.map((tag) => tag.name));
        // Return the latest version
        return sortedTags.pop();
    } catch (error) {
        return "0.0.0";
    }
};

/**
 * getLatestBetaVersion - Gets the latest beta version of Wizarr
 * @returns {Promise<string>} The current version of Wizarr
 */
export const getLatestBetaVersion = async (): Promise<string> => {
    try {
        // Retrieve all tags for the repo
        const response = await octokit.rest.repos.listTags({ owner, repo });
        // Filter out any tags that are not beta versions
        const tags = response.data.filter((tag) => versionBetaRegex.test(tag.name));
        // Sort the tags by version number
        const sortedTags = await sortSemverTags(tags.map((tag) => tag.name));
        // Return the latest version
        return sortedTags.pop();
    } catch (error) {
        return "0.0.0";
    }
};

/**
 * getDescription - Gets the description of the Wizarr repo
 * @returns {Promise<string>} The description of the Wizarr repo
 */
export const getDescription = async (): Promise<string | null> => {
    try {
        // Retrieve the repo
        const response = await octokit.rest.repos.get({ owner, repo });
        // Return the description
        return response?.data?.description;
    } catch (error) {
        return null;
    }
};

/**
 * getLicense - Gets the license of the Wizarr repo
 * @returns {Promise<string>} The license of the Wizarr repo
 */
export const getLicense = async (): Promise<Record<string, string> | null> => {
    try {
        // Retrieve the repo
        const response = await octokit.rest.repos.get({ owner, repo }).catch(() => null);
        // Return the license
        return response?.data?.license as Record<string, string> | null;
    } catch (error) {
        return null;
    }
};
