import { ListResponse } from "../index.types";

/**
 * @api /media-server MediaServer
 */
export type Servers = Server[];
export type ServerResponse = ListResponse<Server>;

/**
 * @api /media-server/:id MediaServer
 */
export interface Server {
    id: string;
    name: string;
    description?: string;
    type: string;
    host: string;
    hostOverride?: string;
    apiKey?: string;
    libraries?: ServerLibraries;
    createdAt: Date;
}

/**
 * @api /media-server/:id/library MediaServerLibrary
 */
export type ServerLibraries = ServerLibrary[];

/**
 * @api /media-server/:id/library/:id MediaServerLibrary
 */
export interface ServerLibrary {
    id: string;
    name: string;
    server: Server;
}

export interface ServerRequest {
    name: string;
    type: string;
    host: string;
    hostOverride?: string;
    apiKey: string;
}
