export interface Information {
    name: string;
    version: string;
    description: string;
    setupRequired: boolean;
    updateAvailable: boolean;
    bugReporting: boolean;
    debug: boolean;
}

export interface InformationRequest {
    name: string;
    description: string;
    bugReporting: boolean;
}
