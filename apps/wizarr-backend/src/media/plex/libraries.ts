import { Server } from "../../api/models/Server/ServerModel";
import { createClient } from "./index";
import { plainToInstance } from "class-transformer";
import { ServerLibrary } from "../../api/models/Server/ServerLibraryModel";

import type { Section } from "@wizarrrr/plex-sdk";

import { connection } from "../../data-source";

export const getLibraries = async <B extends boolean>(server: Server, translate?: B): Promise<B extends true ? ServerLibrary[] : Section[]> => {
    const api = await createClient(server.host, server.apiKey);
    const libraries = await (await api.library()).sections();
    return translate ? translateLibraries(server, libraries) : (libraries as any);
};

export const translateLibrary = (server: Server, library: Section): ServerLibrary => {
    return plainToInstance(ServerLibrary, {
        id: String(library.uuid),
        name: library.title,
        server: server,
    } as ServerLibrary);
};

export const translateLibraries = (server: Server, libraries: Section[]): ServerLibrary[] => {
    return libraries.map((l) => translateLibrary(server, l));
};

export { getLibraries as getPlexLibraries };
export { translateLibrary as translatePlexLibrary, translateLibraries as translatePlexLibraries };
