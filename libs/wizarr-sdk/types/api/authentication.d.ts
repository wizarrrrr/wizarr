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
    createdAt: Date;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}
