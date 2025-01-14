import globalInstance from "axios";
import { GetAllResponse, GetWithQueryParams } from ".";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * WizarrSDK API Client
 * @class WizarrAPI - WizarrSDK API Client
 * @param {string} baseURL - The base URL for the API
 * @param {string} accessToken - The access token for the API
 * @param {AxiosInstance} axios - The axios instance to use
 */
export class WizarrAPI {
    /**
     * Declare the baseURL, accessToken, and axios instance
     */
    public baseURL: string;
    public accessToken: string;
    public axios: AxiosInstance;

    /**
     * Creates an instance of WizarrAPI.
     * @param {string} baseURL - The base URL for the API
     * @param {string} accessToken - The access token for the API
     * @param {AxiosInstance} axios - The axios instance to use
     * @memberof WizarrAPI
     */
    constructor(baseURL?: string, accessToken?: string, axios?: AxiosInstance) {
        this.baseURL = baseURL ?? "/api";
        this.accessToken = accessToken ?? "";
        this.axios = axios ?? globalInstance.create();
    }

    /**
     * Parse the query params to convert arrays to strings with , delimiter
     * @param {object} params - The query params to parse
     * @returns {object} - The parsed query params
     */
    private parseQueryParams(params: GetWithQueryParams | undefined): object {
        if (!params) return {};
        let parsedParams: Record<string, any> = {};
        for (const [key, value] of Object.entries(params)) {
            if (Array.isArray(value)) parsedParams[key] = value.join(",");
            else parsedParams[key] = value;
        }
        return parsedParams;
    }

    /**
     * Function to handle get requests with query filters
     */
    protected async get<T = any, D = any>(url: string, params?: GetWithQueryParams<T>, config?: AxiosRequestConfig<D>): Promise<T> {
        const request = await this.axios.get<T>(`${this.baseURL}/${url}`, { ...config, params: this.parseQueryParams(params) });
        return request.data;
    }

    /**
     * Function to handle get requests with query filters
     */
    protected async getAll<E = any, T = GetAllResponse<E>, D = any>(url: string, params?: GetWithQueryParams<E>, config?: AxiosRequestConfig<D>): Promise<T> {
        const request = await this.axios.get<T>(`${this.baseURL}/${url}`, { ...config, params: this.parseQueryParams(params) });
        return request.data;
    }

    /**
     * Function to handle get requests with query filters
     */
    protected async getOne<E = any, D = any>(url: string, id: string | number, params?: GetWithQueryParams<E>, config?: AxiosRequestConfig<D>): Promise<E> {
        const request = await this.axios.get<E>(`${this.baseURL}/${url}/${id}`, { ...config, params: this.parseQueryParams(params) });
        return request.data;
    }

    /**
     * Function to handle post requests
     */
    protected async post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
        const request = await this.axios.post<T>(`${this.baseURL}/${url}`, data, config);
        return request.data;
    }

    /**
     * Function to handle put requests
     */
    protected async put<T = any, D = any>(url: string, id: string | number, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
        const request = await this.axios.put<T>(`${this.baseURL}/${url}/${id}`, data, config);
        return request.data;
    }

    /**
     * Function to handle patch requests
     */
    protected async patch<T = any, D = any>(url: string, id: string | number, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
        const request = await this.axios.patch<T>(`${this.baseURL}/${url}/${id}`, data, config);
        return request.data;
    }

    /**
     * Function to handle delete requests
     */
    protected async delete<T = any, D = any>(url: string, id: string | number, config?: AxiosRequestConfig<D>): Promise<T> {
        const request = await this.axios.delete<T>(`${this.baseURL}/${url}/${id}`, config);
        return request.data;
    }
}
