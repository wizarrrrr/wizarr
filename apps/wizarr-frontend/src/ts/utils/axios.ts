import axios from "axios";
import { errorToast, infoToast } from "./toasts";
import { useAuthStore } from "@/stores/auth";
import type { InternalAxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        disableInfoToast?: boolean;
        disableErrorToast?: boolean;
    }
}

const setAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore?.user?.jwtToken) config.headers["Authorization"] = `Bearer ${authStore.user.jwtToken}`;
    return config;
};

function handleResponseSuccess<T extends { message?: string }>(response: AxiosResponse<T>) {
    const { config, data } = response;

    if (!config.disableInfoToast && data?.message) {
        infoToast(data.message);
    }

    return response;
}

const handleResponseError = async (error: any) => {
    const { response, config } = error;

    if (!config?.disableErrorToast && response?.data) {
        const { errors, message } = response.data;

        if (errors) {
            Object.values(errors)
                .flat()
                .forEach((msg) => errorToast(String(msg)));
        } else if (message) {
            errorToast(message);
        }
    }

    if (response?.status === 401) {
    }

    return Promise.reject(error);
};

export default function (options?: CreateAxiosDefaults) {
    const apiClient = axios.create({ ...options });
    apiClient.interceptors.request.use(setAuthorizationHeader, (error) => Promise.reject(error));
    apiClient.interceptors.response.use(handleResponseSuccess, handleResponseError);
    return apiClient;
}
