import { Octokit } from "octokit";
import { sortSemverTags, versionBetaRegex } from "./versions.helper";

const octokit = new Octokit();

const repo = "wizarr";
const owner = "wizarrrr";

/**
 * getLatestStableVersion - Gets the latest stable version of Wizarr
 * @returns {Promise<string>} The current version of Wizarr
 */
export const getLatestStableVersion = async (): Promise<string> => {
    // Retrieve all tags for the repo
    const response = await octokit.rest.repos.listTags({ owner, repo });
    // Filter out any tags that are beta versions
    const tags = response.data.filter((tag) => !versionBetaRegex.test(tag.name));
    // Sort the tags by version number
    const sortedTags = await sortSemverTags(tags.map((tag) => tag.name));
    // Return the latest version
    return sortedTags.pop();
};

/**
 * getLatestBetaVersion - Gets the latest beta version of Wizarr
 * @returns {Promise<string>} The current version of Wizarr
 */
export const getLatestBetaVersion = async (): Promise<string> => {
    // Retrieve all tags for the repo
    const response = await octokit.rest.repos.listTags({ owner, repo });
    // Filter out any tags that are not beta versions
    const tags = response.data.filter((tag) => versionBetaRegex.test(tag.name));
    // Sort the tags by version number
    const sortedTags = await sortSemverTags(tags.map((tag) => tag.name));
    // Return the latest version
    return sortedTags.pop();
};

/**
 * getGithubTags - Gets all tags from the Wizarr repo
 * @returns {Promise<string[]>} All tags from the Wizarr repo
 */
export const getGithubTags = async (): Promise<string[]> => {
    // Retrieve all tags for the repo
    const response = await octokit.rest.repos.listTags({ owner, repo });
    // Return all tags
    return response.data.map((tag) => tag.name);
};

/**
 * getDescription - Gets the description of the Wizarr repo
 * @returns {Promise<string>} The description of the Wizarr repo
 */
export const getDescription = async (): Promise<string | null> => {
    // Retrieve the repo
    const response = await octokit.rest.repos.get({ owner, repo }).catch(() => null);
    // Return the description
    return response?.data?.description;
};

/**
 * getLicense - Gets the license of the Wizarr repo
 * @returns {Promise<string>} The license of the Wizarr repo
 */
export const getLicense = async (): Promise<Record<string, string> | null> => {
    // Retrieve the repo
    const response = await octokit.rest.repos.get({ owner, repo }).catch(() => null);
    // Return the license
    return response?.data?.license as Record<string, string> | null;
};
