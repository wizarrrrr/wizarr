import axios from "axios";
import { cachedGetCurrentVersion } from "@/utils/versions.helper";

export const createClient = async (baseUrl: string, apiKey?: string) => {
    return axios.create({
        baseURL: baseUrl,
        headers: {
            Accept: "application/json",
            "X-Emby-Token": apiKey,
            "X-Emby-Client": "Wizarr",
            "X-Emby-Client-Version": await cachedGetCurrentVersion(),
        },
    });
};
