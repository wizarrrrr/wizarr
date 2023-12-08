import { User } from "@/api/models/User/UserModel";
import { Server } from "@/api/models/Server/ServerModel";

import { getJellyfinUser, getJellyfinUsers } from "./jellyfin";
import { getPlexUser, getPlexUsers } from "./plex/users";
import { CreateAxiosDefaults } from "axios";

export const getUsers = async (server: Server, config?: CreateAxiosDefaults): Promise<User[]> => {
    switch (server.type) {
        case "jellyfin":
            return await getJellyfinUsers(server, true, config);
        case "emby":
            return [];
        case "plex":
            return await getPlexUsers(server, true);
        default:
            throw new Error("Invalid server type");
    }
};

export const getUser = async (server: Server, id: string, config?: CreateAxiosDefaults): Promise<User> => {
    switch (server.type) {
        case "jellyfin":
            return await getJellyfinUser(server, id, true, config);
        case "emby":
            return null;
        case "plex":
            return await getPlexUser(server, id, true);
        default:
            throw new Error("Invalid server type");
    }
};
