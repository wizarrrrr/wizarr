/**
 * @api /media-server MediaServer
 */
export type Servers = Server[];

/**
 * @api /media-server/:id MediaServer
 */
export interface Server {
    id: string;
    name: string;
    description?: string;
    type: string;
    host: string;
    apiKey: string;
    libraries?: ServerLibraries;
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
    apiKey: string;
}
