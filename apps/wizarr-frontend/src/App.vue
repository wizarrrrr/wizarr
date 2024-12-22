<template>
    <vue-progress-bar />
    <FullPageLoading v-if="fullPageLoading" />
    <RouterView v-else />
    <Offline />
    <ReloadPrompt />
    <WidgetModalContainer />
    <Help />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapWritableState, mapState, mapActions } from "pinia";
import { useThemeStore } from "@/stores/theme";
import { useInformationStore } from "@/stores/information";
import { useLanguageStore } from "@/stores/language";
import { useAuthStore } from "@/stores/auth";
import { useProgressStore } from "./stores/progress";
import { useVersionStore } from "./stores/version";
import { useGettext, type Language } from "vue3-gettext";
import { container as WidgetModalContainer } from "jenesius-vue-modal";

import Offline from "@/components/Offline.vue";
import FullPageLoading from "@/components/Loading/FullPageLoading.vue";
import BadBackend from "@/components/Toasts/BadBackend.vue";
import UpdateAvailable from "@/components/Toasts/UpdateAvailable.vue";
import DefaultToast from "@/components/Toasts/DefaultToast.vue";
import ReloadPrompt from "@/components/ReloadPrompt.vue";
import Help from "@/components/Help/Help.vue";

import type { ToastID } from "vue-toastification/dist/types/types";
import type { CustomAxiosRequestConfig } from "./ts/utils/axios";
import type { Information as IInformation } from "@wizarrrrr/wizarr-sdk";

import type { Toasts } from "./ts/utils/toasts";
import type { Socket } from "socket.io-client";

export default defineComponent({
    name: "App",
    components: {
        Offline,
        FullPageLoading,
        ReloadPrompt,
        WidgetModalContainer,
        Help,
    },
    data() {
        return {
            gettext: null as Language | null,
            connectionToast: null as ToastID | null,
            notificationSocket: null as Socket | null,
            notificationBuffer: [],
            retryCount: 0,
        };
    },
    computed: {
        ...mapState(useInformationStore, ["setupRequired"]),
        ...mapState(useAuthStore, ["token"]),
        ...mapState(useThemeStore, ["theme"]),
        ...mapState(useLanguageStore, ["language"]),
        ...mapWritableState(useProgressStore, ["progress", "fullPageLoading"]),
    },
    methods: {
        ...mapActions(useThemeStore, ["updateTheme"]),
        ...mapActions(useLanguageStore, ["updateLanguage", "updateAvailableLanguages"]),
        ...mapActions(useInformationStore, ["setServerData"]),
        ...mapActions(useVersionStore, ["setVersionData"]),
        ...mapActions(useAuthStore, ["isAuthenticated"]),
        async axiosRetry<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
            return new Promise(async (resolve, reject) => {
                this.$axios
                    .get(url, config)
                    .then((response) => resolve(response.data))
                    .catch(() => {
                        // If we have retried 5 times, show a toast and stop retrying
                        if (this.retryCount >= 2) {
                            return reject(new Error("Retried 5 times, giving up. Please reload the page."));
                        }

                        // Increment the retry count
                        this.retryCount++;

                        // If there is no connection toast, show one
                        if (this.connectionToast == null) this.connectionToast = this.$toast.error(BadBackend, { timeout: false, closeButton: false, draggable: false, closeOnClick: false });
                        return new Promise((resolve) => setTimeout(resolve, 5000)).then(async () => resolve(await this.axiosRetry(url, config)));
                    });
            });
        },
        async setVersionStore() {
            const versionData = await this.$axios.get("/api/version").then((response) => response.data);
            this.setVersionData(versionData);
        },
        async notificationService() {
            // Connect to the socket notifications service
            if (this.isAuthenticated()) {
                this.notificationSocket = this.$io("/notifications", {
                    auth: {
                        token: this.token,
                    },
                });

                this.notificationSocket.on("notification", (notification: { type?: keyof Toasts; message: string }) => {
                    if (notification.message) {
                        this.$toast[notification.type ?? "info"](notification.message);
                    }
                });
            }
        },
    },
    watch: {
        token: {
            immediate: true,
            handler(token, oldToken) {
                if (token === null) {
                    this.$router.push("/login");
                    this.notificationSocket?.disconnect();
                }

                if (token !== null && oldToken === null) {
                    this.notificationService();
                }
            },
        },
        theme: {
            immediate: true,
            handler(theme) {
                this.updateTheme(theme);
            },
        },
        language: {
            immediate: true,
            handler(language) {
                if (this.gettext !== null) {
                    this.updateLanguage(this.gettext, language);
                }
            },
        },
        progress: {
            immediate: true,
            handler(progress) {
                if (progress) this.$Progress.start();
                else this.$Progress.finish();
            },
        },
    },
    async mounted() {
        this.$Progress.start();

        // Initialize gettext
        this.gettext = useGettext();

        // Set the language and available languages
        this.updateLanguage(this.gettext, this.language);
        this.updateAvailableLanguages(this.gettext);

        // Set the theme
        this.updateTheme(this.theme);

        // Get the server data
        const serverData = this.axiosRetry<IInformation>("/api/information", {
            disableErrorToast: true,
            disableInfoToast: true,
        });

        // Background task that will run a function once the serverData promise resolves
        serverData.then((serverData) => {
            // If there was a connection toast, dismiss it and show a success toast
            if (this.connectionToast !== null) {
                this.$toast.dismiss(this.connectionToast);
                this.$toast.success(DefaultToast("Connection Online", "Connection to backend established."));
            }

            // If update is available, open update message
            if (serverData.updateAvailable) {
                this.$toast.info(UpdateAvailable, {
                    timeout: false,
                    closeButton: false,
                    draggable: false,
                    closeOnClick: false,
                });
            }

            // Set the server data
            this.setServerData(serverData);
            this.setVersionStore();

            this.$router.afterEach((guard) => {
                if (this.setupRequired && guard.name !== "setup") this.$router.push("/setup");
                if (!this.setupRequired && guard.name === "setup") this.$router.push("/");
            });
        });

        // If the serverData promise rejects, show a toast and retry
        serverData.catch((error: Error) => {
            this.$toast.error(error.message, { timeout: false, closeButton: false, draggable: false, closeOnClick: false });
            console.log(error);
        });

        // Connect to the socket notifications service
        this.notificationService();

        // Finish the progress bar
        this.$Progress.finish();
        this.fullPageLoading = false;
    },
});
</script>
@/stores/information
