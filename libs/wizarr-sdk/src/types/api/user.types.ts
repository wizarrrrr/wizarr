import { ListResponse, Server } from "../index.types";

export interface User {
    id: string;
    name: string;
    avatar: string;
    username: string;
    email: string;
    expiresAt: Date | null;
    server: Server;
    invitation: object;
    createdAt: Date;
}

export type Users = User[];
export type UserStore = { users: Users };
export type UsersResponse = ListResponse<User>;
