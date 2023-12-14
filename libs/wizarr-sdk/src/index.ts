import { WizarrAPI } from "./api";

import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { Information as IInformation, Version as IVersion, Health as IHealth, Admin as IAdmin, Server as IServer } from "./types/index.types";

export * from "./types/index.types";

// Define a conditional type to filter out non-object keys
type ObjectKeys<T> = {
    [K in keyof T]: T[K] extends object ? K : never;
}[keyof T];

/**
 * Params for get requests with query filters
 * @interface GetWithQueryParams
 * @template T
 */
export interface GetWithQueryParams<T = any> {
    /**
     * Relations to include in the response
     * @default []
     */
    relations?: ObjectKeys<T> | Array<ObjectKeys<T>>;
    /**
     * Limit the number of results
     * @default 10
     */
    limit?: number;
    /**
     * Page offset for pagination
     * @default 0
     */
    page?: number;
    /**
     * Cache the response query
     * @default false
     */
    cache?: boolean;
}

/**
 * Get interface mask for getAll responses
 * @interface GetAllResponse
 * @template T
 */
export interface GetAllResponse<T> {
    total_data: number;
    rows: T[];
}

export interface APIHandler<E = any, T = GetAllResponse<E>, R = GetWithQueryParams<E>> {
    getAll: <D = any>(params?: R, config?: AxiosRequestConfig<D>) => Promise<T>;
    getOne: <D = any>(id: string | number, params?: R, config?: AxiosRequestConfig<D>) => Promise<E>;
    post: <D = any>(data?: D, config?: AxiosRequestConfig<D>) => Promise<E>;
    put: <D = any>(id: string | number, data?: D, config?: AxiosRequestConfig<D>) => Promise<E>;
    patch: <D = any>(id: string | number, data?: D, config?: AxiosRequestConfig<D>) => Promise<E>;
    delete: <D = any>(id: string | number, config?: AxiosRequestConfig<D>) => Promise<E>;
}

/**
 * WizarrSDK Client
 * @class WizarrSDK - WizarrSDK Client
 * @param {string} baseURL - The base URL for the API
 * @param {string} accessToken - The access token for the API
 * @param {AxiosInstance} axios - The axios instance to use
 */
export default class WizarrSDK extends WizarrAPI {
    /**
     * Creates an instance of WizarrSDK.
     * @param {string} baseURL - The base URL for the API
     * @param {string} accessToken - The access token for the API
     * @param {AxiosInstance} axios - The axios instance to use
     * @memberof WizarrSDK
     */
    constructor(baseURL?: string, accessToken?: string, axios?: AxiosInstance) {
        super(baseURL, accessToken, axios);
    }

    /**
     * Rest Generator for API calls
     * @param {string} url - The url to call
     */
    private restGenerator<T>(url: string): APIHandler<T> {
        return {
            getAll: (params?: GetWithQueryParams<T>, config?: AxiosRequestConfig) => this.getAll<T>(url, params, config),
            getOne: (id: string | number, params?: GetWithQueryParams<T>, config?: AxiosRequestConfig) => this.getOne<T>(url, id, params, config),
            post: (data?: any, config?: AxiosRequestConfig) => this.post<T>(url, data, config),
            put: (id: string | number, data?: any, config?: AxiosRequestConfig) => this.put<T>(url, id, data, config),
            patch: (id: string | number, data?: any, config?: AxiosRequestConfig) => this.patch<T>(url, id, data, config),
            delete: (id: string | number, config?: AxiosRequestConfig) => this.delete<T>(url, id, config),
        };
    }

    /**
     * Get the information about the server
     * @returns {Promise<AxiosResponse<IInformation>>}
     */
    public async getInformation(): Promise<IInformation> {
        return this.get<IInformation>("/server");
    }

    /**
     * Get the version information about the server
     * @returns {Promise<AxiosResponse<IVersion>>}
     */
    public async getVersion(): Promise<IVersion> {
        return this.get<IVersion>("/version");
    }

    /**
     * Get the health information about the server
     * @returns {Promise<IHealth>}
     */
    public async getHealth(): Promise<IHealth> {
        return this.get<IHealth>("/health");
    }

    public admins = this.restGenerator<IAdmin>("/admins");
    public servers = this.restGenerator<IServer>("/servers");
}
