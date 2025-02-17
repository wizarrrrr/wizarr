import { InvalidServer } from "../api/exceptions/InvalidServer";
import axios, { AxiosRequestConfig } from "axios";
import { isURL } from "class-validator";

/**
 * serverEndpoints
 * Object containing all the endpoints for each server type
 */
export const serverEndpoints: Record<string, Record<string, string>> = {
    plex: {
        endpoint: "identity",
        authenticatedEndpoint: "connections?X-Plex-Token=",
    },
    jellyfin: {
        endpoint: "System/Info/Public",
        authenticatedEndpoint: "System/Info?api_key=",
    },
    emby: {
        endpoint: "System/Info/Public",
        authenticatedEndpoint: "System/Info?api_key=",
    },
};

/**
 * globalAxiosConfig
 * Global Axios configuration for sending verification requests
 */
export const globalAxiosConfig: AxiosRequestConfig = {
    timeout: 10000,
};

/**
 * objectScanner
 * Scan an object for to find any values or nested values that match a string
 * @param {string} string
 * @param {object} object
 * @returns {boolean}
 */
export const objectScanner = async (string: string, object: object): Promise<boolean> => {
    // Convert object to string
    const objectString = JSON.stringify(object);

    // Return boolean based on whether the string was found in the object
    return objectString.includes(string);
};

/**
 * verifyPlexServer
 * Verify a host is a Plex server
 * @param {string} host
 * @returns {boolean}
 */
export const verifyPlexServer = async (host: string, apiKey?: string): Promise<boolean> => {
    // Validate host is a URL against class-validator
    if (!isURL(host, { require_tld: false })) throw new InvalidServer("Host is not a valid URL");

    // Parse host into URL object and extract hostname
    const url = new URL(`${host}/${apiKey ? serverEndpoints.plex.authenticatedEndpoint : serverEndpoints.plex.endpoint}${apiKey || ""}`);

    // Test Plex API endpoint to verify host is a Plex server
    const response = await axios.get(url.href).catch((error) => {
        return error.response;
    });

    return response.status === 200;
};

/**
 * verifyJellyfinServer
 * Verify a host is a Jellyfin server
 * @param {string} host
 * @returns {boolean}
 */
export const verifyJellyfinServer = async (host: string, apiKey?: string): Promise<boolean> => {
    // Validate host is a URL against class-validator
    if (!isURL(host, { require_tld: false })) throw new InvalidServer("Host is not a valid URL");

    // Parse host into URL object and extract hostname
    const url = new URL(`${host}/${apiKey ? serverEndpoints.jellyfin.authenticatedEndpoint : serverEndpoints.jellyfin.endpoint}${apiKey || ""}`);

    // Test Jellyfin API endpoint to verify host is a Jellyfin server
    const response = await axios.get(url.href).catch((error) => {
        return error.response;
    });

    return response.status === 200 && (await objectScanner("Jellyfin", response.data));
};

/**
 * verifyEmbyServer
 * Verify a host is an Emby server
 * @param {string} host
 * @returns {boolean}
 */
export const verifyEmbyServer = async (host: string, apiKey?: string): Promise<boolean> => {
    // Validate host is a URL against class-validator
    if (!isURL(host, { require_tld: false })) throw new InvalidServer("Host is not a valid URL");

    // Parse host into URL object and extract hostname
    const url = new URL(`${host}/${apiKey ? serverEndpoints.emby.authenticatedEndpoint : serverEndpoints.emby.endpoint}${apiKey || ""}`);

    // Test Emby API endpoint to verify host is an Emby server
    const response = await axios.get(url.href).catch((error) => {
        return error.response;
    });

    return response.status === 200;
};

/**
 * verifyServerType
 * Verify a host is a specific server type based on the host and server type
 * @param {string} host
 * @param {string} serverType
 * @returns {boolean}
 */
export const verifyServerType = async (host: string, serverType: string, apiKey?: string): Promise<boolean> => {
    // Validate host is a URL against class-validator
    if (!isURL(host, { require_tld: false })) throw new InvalidServer("Host is not a valid URL");

    // Determine server type and verify host is that type
    if (serverType === "plex") return await verifyPlexServer(host, apiKey);
    if (serverType === "jellyfin") return await verifyJellyfinServer(host, apiKey);
    if (serverType === "emby") return await verifyEmbyServer(host, apiKey);

    // Throw an error if the server type could not be determined
    throw new InvalidServer("Could not determine server type");
};

/**
 * determineServerType
 * Determine the type of server based on the host
 * @param {string} host
 * @returns {string}
 */
export const determineServerType = async (host: string, apiKey?: string): Promise<string> => {
    // Validate host is a URL against class-validator
    if (!isURL(host, { require_tld: false })) throw new InvalidServer("Host is not a valid URL");

    // Determine server type based on host
    if (await verifyPlexServer(host, apiKey)) return "plex";
    if (await verifyJellyfinServer(host, apiKey)) return "jellyfin";
    if (await verifyEmbyServer(host, apiKey)) return "emby";

    // Throw an error if the server type could not be determined
    throw new InvalidServer("Could not determine server type");
};
