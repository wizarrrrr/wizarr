import { Server } from "../../api/models/Server/ServerModel";
import { createClient } from "./index";
import { User } from "../../api/models/User/UserModel";
import { MyPlexAccount } from "@wizarrrrr/plex-sdk";
import { plainToInstance } from "class-transformer";

export const getUsers = async <B extends boolean>(server: Server, translate?: B): Promise<B extends true ? User[] : MyPlexAccount[]> => {
    const api = await createClient(server.host, server.apiKey);
    const account = api.myPlexAccount();
    return translate ? translateUsers(server, await account.users()) : ((await account.users()) as any);
};

export const getUser = async <B extends boolean>(server: Server, id: string, translate?: B): Promise<B extends true ? User : MyPlexAccount> => {
    const api = await createClient(server.host, server.apiKey);
    const account = api.myPlexAccount();
    return translate ? translateUser(server, await account.user(id)) : ((await account.user(id)) as any);
};

export function translateUser(server: Server, plexUser: MyPlexAccount): User {
    return plainToInstance(User, {
        id: String(plexUser.id),
        avatar: plexUser.thumb,
        username: plexUser.username,
        email: plexUser.email,
        server: server,
    } as User);
}

export function translateUsers(server: Server, users: MyPlexAccount[]): User[] {
    return users.map((u) => translateUser(server, u));
}

export { getUser as getPlexUser, getUsers as getPlexUsers };
export { translateUser as translatePlexUser, translateUsers as translatePlexUsers };
