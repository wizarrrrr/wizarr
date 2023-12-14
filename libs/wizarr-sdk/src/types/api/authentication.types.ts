/**
 * @api {get} /admin Get all admins
 */
export type Admins = Admin[];

/**
 * @api {get} /admin/:id Get admin by id
 */
export interface Admin {
    id: string;
    name: string;
    username: string;
    email: string;
    roles: Role[];
    sessions: Session[];
    createdAt: Date;
}

export interface Role {
    id: number;
    name: string;
}

export interface Session {
    id: string;
    ip: string;
    userAgent: string;
    accessJti: string;
    refreshJti: string;
    user: Admin;
    userId: string;
    lastUsedAt: Date;
    createdAt: Date;
}

export interface LoginRequest {
    username: string;
    password: string;
}
