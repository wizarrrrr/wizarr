import apiClient from "../ts/utils/axios";

import type { App } from "vue";
import type { CreateAxiosDefaults } from "axios";
import type { PiniaPluginContext } from "pinia";

declare module "pinia" {
    export interface PiniaCustomProperties {
        $axios: ReturnType<typeof apiClient>;
    }
}

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $axios: ReturnType<typeof apiClient>;
    }
}

const useAxios = (options?: CreateAxiosDefaults) => {
    return apiClient(options);
};

const piniaPluginAxios = (context: PiniaPluginContext) => {
    const axios = useAxios(context.options as CreateAxiosDefaults);
    context.store.$axios = axios;
};

const vuePluginAxios = {
    install: (app: App, options?: CreateAxiosDefaults) => {
        const axios = useAxios(options);
        app.config.globalProperties.$axios = axios;
    },
};

export default vuePluginAxios;
export { useAxios, piniaPluginAxios, vuePluginAxios };
