<template>
    <vue-progress-bar />
    <FullPageLoading v-if="fullPageLoading" />
    <RouterView v-else />
    <Offline />
    <ReloadPrompt />
    <WidgetModalContainer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapWritableState, mapState, mapActions } from "pinia";
import { useThemeStore } from "@/stores/theme";
import { useServerStore } from "./stores/server";
import { useLanguageStore } from "@/stores/language";
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

import type { ToastID } from "vue-toastification/dist/types/types";
import type { CustomAxiosRequestConfig } from "./ts/utils/axios";
import type { Information as IInformation } from "@wizarrrr/wizarr-sdk";

export default defineComponent({
    name: "App",
    components: {
        Offline,
        FullPageLoading,
        ReloadPrompt,
        WidgetModalContainer,
    },
    data() {
        return {
            gettext: null as Language | null,
            connectionToast: null as ToastID | null,
        };
    },
    computed: {
        ...mapState(useThemeStore, ["theme"]),
        ...mapState(useLanguageStore, ["language"]),
        ...mapWritableState(useProgressStore, ["progress", "fullPageLoading"]),
    },
    methods: {
        ...mapActions(useThemeStore, ["updateTheme"]),
        ...mapActions(useLanguageStore, ["updateLanguage", "updateAvailableLanguages"]),
        ...mapActions(useServerStore, ["setServerData"]),
        ...mapActions(useVersionStore, ["setVersionData"]),
        async axiosRetry<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
            return await this.$axios
                .get(url, config)
                .then((response) => response.data)
                .catch(async () => {
                    if (this.connectionToast == null) this.connectionToast = this.$toast.error(BadBackend, { timeout: false, closeButton: false, draggable: false, closeOnClick: false });
                    return new Promise((resolve) => setTimeout(resolve, 5000)).then(async () => await this.axiosRetry(url));
                });
        },
        async setVersionStore() {
            const versionData = await this.$axios.get("/api/version").then((response) => response.data);
            this.setVersionData(versionData);
        },
    },
    watch: {
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
        const serverData = await this.axiosRetry<IInformation>("/api/information", {
            disableErrorToast: true,
            disableInfoToast: true,
        });

        // If there was a connection toast, dismiss it and show a success toast
        if (this.connectionToast !== null) {
            this.$toast.dismiss(this.connectionToast);
            this.$toast.success(DefaultToast("Connection Online", "Connection to backend established."));
        }

        // If setup is required, redirect to setup page if current route is not setup page
        if (serverData.setupRequired && this.$router.currentRoute.value.name !== "setup") this.$router.push("/setup");
        if (!serverData.setupRequired && this.$router.currentRoute.value.name === "setup") this.$router.push("/");

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

        // Finish the progress bar
        this.$Progress.finish();
        this.fullPageLoading = false;
    },
});
</script>
