import { Server } from "../../api/models/Server/ServerModel";
import { createClient } from "./index";
import { User } from "../../api/models/User/UserModel";
import { plainToInstance } from "class-transformer";
import { CreateAxiosDefaults } from "axios";

import type { UserDto } from "@jellyfin/sdk/lib/generated-client/models";

export const getUsers = async <B extends boolean>(server: Server, translate?: B, config?: CreateAxiosDefaults): Promise<B extends true ? User[] : UserDto[]> => {
    const api = await createClient(server.host, server.apiKey, config);
    return translate ? translateUsers(server, (await api.get<UserDto[]>("/Users")).data) : ((await api.get<UserDto[]>("/Users")).data as any);
};

export const getUser = async <B extends boolean>(server: Server, id: string, translate?: B, config?: CreateAxiosDefaults): Promise<B extends true ? User : UserDto> => {
    const api = await createClient(server.host, server.apiKey, config);
    return translate ? translateUser(server, (await api.get<UserDto>(`/Users/${id}`)).data) : ((await api.get<UserDto>(`/Users/${id}`)).data as any);
};

export function translateUser(server: Server, jellyfinUser: UserDto): User {
    return plainToInstance(User, {
        id: jellyfinUser.Id,
        avatar: `${server.host}/Users/${jellyfinUser.Id}/Images/Primary`,
        username: jellyfinUser.Name,
        server: server,
        lastLoginAt: new Date(jellyfinUser.LastLoginDate),
        lastActivityAt: new Date(jellyfinUser.LastActivityDate),
    } as User);
}

export function translateUsers(server: Server, users: UserDto[]): User[] {
    return users.map((u) => translateUser(server, u));
}

export { getUser as getJellyfinUser, getUsers as getJellyfinUsers };
export { translateUser as translateJellyfinUser, translateUsers as translateJellyfinUsers };
