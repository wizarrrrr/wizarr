import { User } from "@/api/models/User/UserModel";
import { Server } from "@/api/models/Server/ServerModel";

import { getJellyfinUser, getJellyfinUsers } from "./jellyfin";
import { getPlexUser, getPlexUsers } from "./plex/users";

export const getUsers = async (server: Server): Promise<User[]> => {
    switch (server.type) {
        case "jellyfin":
            return await getJellyfinUsers(server, true);
        case "emby":
            return [];
        case "plex":
            return await getPlexUsers(server, true);
        default:
            throw new Error("Invalid server type");
    }
};

export const getUser = async (server: Server, id: string): Promise<User> => {
    switch (server.type) {
        case "jellyfin":
            return await getJellyfinUser(server, id, true);
        case "emby":
            return null;
        case "plex":
            return await getPlexUser(server, id, true);
        default:
            throw new Error("Invalid server type");
    }
};
