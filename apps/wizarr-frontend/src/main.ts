import "./assets/scss/main.scss";
import { warn, debug, trace, info, error } from "@tauri-apps/plugin-log";

function overrideConsole() {
    if (window.__TAURI__) {
        console.warn = (...args) => warn(args.join(" "));
        console.debug = (...args) => debug(args.join(" "));
        console.trace = (...args) => trace(args.join(" "));
        console.info = (...args) => info(args.join(" "));
        console.error = (...args) => error(args.join(" "));
    }
}

import { createApp } from "vue";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/auth";
import { defaultConfig, plugin } from "@formkit/vue";

import Axios, { piniaPluginAxios } from "./plugins/axios";
import Filters, { piniaPluginFilters } from "./plugins/filters";
import Firebase, { piniaPluginFirebase } from "./plugins/firebase";
import Socket, { piniaPluginSocketIO } from "./plugins/socket";
import Toast, { piniaPluginToast } from "./plugins/toasts";
import Tours, { piniaPluginTours } from "./plugins/tours";
import WebShare, { piniaPluginWebShare } from "./plugins/webshare";

import App from "./App.vue";
import Setup from "./modules/setup/views/Setup.vue";
import FullPageLoading from "@/components/Loading/FullPageLoading.vue";
import Analytics from "./plugins/analytics";
import FloatingVue from "floating-vue";
import Modal from "./plugins/modal";
import ProgressOptions from "./assets/configs/DefaultProgress";
import RocketChat from "./plugins/rocketChat";
import Sentry from "./plugins/sentry";
import AxiosRetry from "./plugins/axiosRetry";
import ToastOptions from "./assets/configs/DefaultToasts";
import ToastPlugin from "vue-toastification";
import VueFeather from "vue-feather";
import VueProgressBar from "@aacassandra/vue3-progressbar";
import formkitConfig from "./formkit.config";
import i18n from "./i18n";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import async from "@wizarrrrr/async";
import { axiosRetry } from "./plugins/axiosRetry";
import type { Information } from "@wizarrrrr/wizarr-sdk";
import { useInformationStore } from "./stores/information";
import { GraphQLClient } from "graphql-request";
import Sticky from "vue3-sticky-directive";

const startApp = async () => {
    // Create the loading component
    const loading = createApp(FullPageLoading);
    loading.mount("#loading");

    // Create the app instance and pinia
    const app = createApp(App);
    const setup = createApp(Setup);
    const pinia = createPinia();

    // Place the loading component on the app's globalProperties
    app.config.globalProperties.$loading = loading;

    // Call the override function
    overrideConsole();

    pinia.use(piniaPluginPersistedstate);
    pinia.use(piniaPluginToast);
    pinia.use(piniaPluginAxios);
    pinia.use(piniaPluginSocketIO);
    pinia.use(piniaPluginFilters);
    pinia.use(piniaPluginWebShare);
    pinia.use(piniaPluginFirebase);
    pinia.use(piniaPluginTours);

    app.use(pinia);

    setup.use(pinia);
    setup.use(i18n);
    setup.use(ToastPlugin, ToastOptions);
    setup.use(Axios);
    setup.use(plugin, defaultConfig(formkitConfig));
    setup.use(Toast);

    // Get Information from Server
    const informationStore = useInformationStore();
    const [serverError, serverData] = await async(axiosRetry<Information>, "/api/information");

    // Handle Server Error
    if (serverError) {
        console.error(serverError);
    }

    // Set Server Data
    if (!serverError) informationStore.setServerData(serverData);

    // If setupRequired then redirect to /setup
    if (informationStore.setupRequired === true) {
        loading.unmount();
        return setup.mount("#setup");
    }

    // Verify login state
    const authStore = useAuthStore();
    const [error, undefined] = await async(authStore.refreshToken);

    if (error) {
        const attemptedURL = encodeURIComponent(window.location.pathname);
        router.push({ path: "/login", query: { url: attemptedURL } });
    }

    app.config.globalProperties.env = {
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
    };

    const blogClient = new GraphQLClient("https://eu-west-2.cdn.hygraph.com/content/cm794oacz001307w5uvanqvdo/master");
    app.config.globalProperties.$blogClient = blogClient;

    app.use(router);
    app.use(ToastPlugin, ToastOptions);
    app.use(Axios);
    app.use(AxiosRetry);
    app.use(Toast);
    app.use(i18n);
    app.use(VueProgressBar, ProgressOptions);
    app.use(FloatingVue);
    app.use(plugin, defaultConfig(formkitConfig));
    app.use(Socket, { uri: window.location.origin, opts: { path: "/api/socket.io" } });
    app.use(Filters);
    app.use(Sentry);
    app.use(Analytics);
    app.use(Modal);
    app.use(WebShare);
    app.use(Firebase);
    app.use(Tours, { i18n: i18n });
    app.use(RocketChat);
    app.use(Sticky);

    app.component("VueFeather", VueFeather);

    app.config.globalProperties.$help = async (id: string) => {
        window.open(`/docs/${id}`, "_blank", "width=600, height=700, toolbar=no, menubar=no");
    };

    app.mount("#app");

    return { app, pinia };
};

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        env: {
            NODE_ENV: "development" | "production";
        };
        $help: (id: string) => void;
        $loading: App<Element>;
        $blogClient: GraphQLClient;
    }

    interface GlobalComponents {
        VueFeather: typeof VueFeather;
    }
}

startApp();
