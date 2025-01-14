import { Server } from "../../api/models/Server/ServerModel";
import { createClient } from "./index";
import { ServerLibrary } from "../../api/models/Server/ServerLibraryModel";
import { plainToInstance } from "class-transformer";
import { CreateAxiosDefaults } from "axios";

import type { BaseItemDtoQueryResult, BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export const getLibraries = async <B extends boolean>(server: Server, translate?: B, config?: CreateAxiosDefaults): Promise<B extends true ? ServerLibrary[] : BaseItemDto[]> => {
    const api = await createClient(server.host, server.apiKey, config);
    return translate ? translateLibraries(server, (await api.get<BaseItemDtoQueryResult>("/Library/MediaFolders")).data.Items) : ((await api.get<BaseItemDtoQueryResult>("/Library/MediaFolders")).data.Items as any);
};

export function translateLibrary(server: Server, jellyfinLibrary: BaseItemDto): ServerLibrary {
    return plainToInstance(ServerLibrary, {
        id: String(jellyfinLibrary.Id),
        name: jellyfinLibrary.Name,
        server: server,
    } as ServerLibrary);
}

export function translateLibraries(server: Server, libraries: BaseItemDto[]): ServerLibrary[] {
    return libraries.map((l) => translateLibrary(server, l));
}

export { getLibraries as getJellyfinLibraries };
export { translateLibrary as translateJellyfinLibrary, translateLibraries as translateJellyfinLibraries };
