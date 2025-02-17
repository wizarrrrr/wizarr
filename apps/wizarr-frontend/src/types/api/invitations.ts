export type Invitations = Invitation[];

export interface Invitation {
    id: string;
    code: string;
    server: Server;
    used: boolean;
    unlimited: boolean;
    durationAt: any;
    expiresAt: any;
    usedAt: any;
    createdAt: string;
}

export interface Server {
    id: string;
    name: string;
    description: string;
    type: string;
    host: string;
    hostOverride: any;
    createdAt: string;
}
