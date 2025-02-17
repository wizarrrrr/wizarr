import apiClient from "@/ts/utils/axios";
import BadBackend from "@/components/Toasts/BadBackend.vue";
import toast from "@/ts/utils/toasts";
import defaultToast from "@/components/Toasts/DefaultToast.vue";

import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { App } from "vue";
import type { ToastID } from "vue-toastification/dist/types/types";

let MAX_RETRIES = 2;
let RETRY_DELAY = 5000;

interface RetryOptions extends AxiosRequestConfig {
    maxRetries?: number;
    retryDelay?: number;
}

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $axiosRetry: typeof axiosRetry;
    }
}

const axiosRetry = async function <T>(url: string, config?: RetryOptions): Promise<T> {
    let retryCount = 0;
    let connectionToast: ToastID | undefined;
    let axios = apiClient();

    const attemptRequest = async (): Promise<T> => {
        try {
            const response: AxiosResponse<T> = await axios.get<T>(url, config);
            if (connectionToast !== undefined) {
                toast.dismiss(connectionToast);
                toast.success(defaultToast("Connection Online", "Connection to backend established."));
            }
            return response.data;
        } catch (error) {
            if (retryCount >= (config?.maxRetries ?? MAX_RETRIES)) {
                toast.error("Retried multiple times, giving up. Please reload the page.");
                throw error;
            }
            retryCount++;
            if (!connectionToast) {
                connectionToast = toast.error(BadBackend, {
                    timeout: false,
                    closeButton: false,
                    draggable: false,
                    closeOnClick: false,
                });
            }
            await new Promise((resolve) => setTimeout(resolve, config?.retryDelay ?? RETRY_DELAY));
            return attemptRequest();
        }
    };
    return attemptRequest();
};

export default {
    install(app: App) {
        app.config.globalProperties.$axiosRetry = axiosRetry;
    },
};
