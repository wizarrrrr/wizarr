import { ListResponse } from "..";

export interface User {
    id: string;
    name: string;
    avatar: string;
    username: string;
    email: string;
    expiresAt: Date | null;
    server: Server;
    invitation: Invitation;
    createdAt: Date;
}

export type User = UserModel;
export type Users = User[];
export type UserStore = { users: Users };
export type UsersResponse = ListResponse<User>;
