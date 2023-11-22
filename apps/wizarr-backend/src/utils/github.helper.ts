import { Octokit } from "octokit";
import { sortSemverTags, versionBetaRegex } from "./versions.helper";

const octokit = new Octokit();

const repo = "wizarr";
const owner = "wizarrrr";

export async function getLatestStableVersion() {
    // Retrieve all tags for the repo
    const response = await octokit.rest.repos.listTags({ owner, repo });

    // Filter out any tags that are beta versions
    const tags = response.data.filter((tag) => !versionBetaRegex.test(tag.name));

    // Sort the tags by version number
    const sortedTags = await sortSemverTags(tags.map((tag) => tag.name));

    // Return the latest version
    return sortedTags.pop();
}

export async function getLatestBetaVersion() {
    // Retrieve all tags for the repo
    const response = await octokit.rest.repos.listTags({ owner, repo });

    // Filter out any tags that are not beta versions
    const tags = response.data.filter((tag) => versionBetaRegex.test(tag.name));

    // Sort the tags by version number
    const sortedTags = await sortSemverTags(tags.map((tag) => tag.name));

    // Return the latest version
    return sortedTags.pop();
}
