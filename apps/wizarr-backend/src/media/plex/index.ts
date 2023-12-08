import { PlexServer } from "@wizarrrr/plex-sdk";

export const createClient = async (baseUrl: string, apiKey?: string) => {
    return new PlexServer(baseUrl, apiKey);
};
