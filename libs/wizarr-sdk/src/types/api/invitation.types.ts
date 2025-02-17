import { Admin, ListResponse, Server, ServerLibrary, User } from "../index.types";

export type Invitations = Invitation[];
export type InvitationResponse = ListResponse<Invitation>;

export interface Invitation {
    id: string;
    code: string;
    server: Server;
    duration: number;
    used: boolean;
    unlimited: boolean;
    users: User[];
    libraries: ServerLibrary[];
    admin: Admin;
    expiresAt: Date;
    usedAt: Date;
    createdAt: Date;
}

export interface InvitationRequest {
    server: string;
    code: string;
    used?: boolean;
    unlimited?: boolean;
    users?: string[];
    libraries?: string[];
    durationAt?: Date | null;
    expiresAt?: Date | null;
    usedAt?: Date;
}
