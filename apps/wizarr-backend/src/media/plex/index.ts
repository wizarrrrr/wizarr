import { PlexServer } from "@wizarrrr/plex-sdk/src";

export const createClient = async (baseUrl: string, apiKey?: string) => {
    return new PlexServer(baseUrl, apiKey);
};
