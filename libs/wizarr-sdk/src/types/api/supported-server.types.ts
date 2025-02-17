export type SupportedServers = SupportedServer[];

export interface SupportedServer {
    name: string;
    slug: string;
    description: string;
    logo: string;
    website: string;
    docs: string;
    api?: string;
    repository?: string;
}
