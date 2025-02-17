/**
 * @api {get} /health Get API health status
 */
export interface Health {
    status: string;
    version: string;
}
