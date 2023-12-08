import axios, { CreateAxiosDefaults } from "axios";
import { cachedGetCurrentVersion } from "@/utils/versions.helper";

export const getAuthorizationHeader = async (apiKey?: string) => {
    return [
        `MediaBrowser Client="Wizarr"`, // Client name
        `Version="${await cachedGetCurrentVersion()}"`, // Client version
        `Token="${apiKey}"`, // API key
    ].join(", ");
};

export const createClient = async (baseUrl: string, apiKey?: string, config?: CreateAxiosDefaults) => {
    return axios.create({
        baseURL: baseUrl,
        headers: {
            Accept: "application/json",
            Authorization: await getAuthorizationHeader(apiKey),
        },
        ...config,
    });
};

export * from "./users";
