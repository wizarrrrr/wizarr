<template>
    <vue-progress-bar />
    <RouterView />
    <Offline />
    <ReloadPrompt />
    <WidgetModalContainer />
    <Help />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "pinia";
import { useThemeStore } from "@/stores/theme";
import { useInformationStore } from "@/stores/information";
import { useLanguageStore } from "@/stores/language";
import { useVersionStore } from "./stores/version";
import { useGettext, type Language } from "vue3-gettext";
import { container as WidgetModalContainer } from "jenesius-vue-modal";

import Offline from "@/components/Offline.vue";
import UpdateAvailable from "@/components/Toasts/UpdateAvailable.vue";
import ReloadPrompt from "@/components/ReloadPrompt.vue";
import Help from "@/components/Help/Help.vue";

import type { Information as IInformation } from "@wizarrrrr/wizarr-sdk";

export default defineComponent({
    name: "App",
    components: {
        Offline,
        ReloadPrompt,
        WidgetModalContainer,
        Help,
    },
    data() {
        return {
            gettext: null as Language | null,
        };
    },
    computed: {
        ...mapState(useThemeStore, ["theme"]),
        ...mapState(useLanguageStore, ["language"]),
    },
    methods: {
        ...mapActions(useThemeStore, ["updateTheme"]),
        ...mapActions(useLanguageStore, ["updateLanguage", "updateAvailableLanguages"]),
        ...mapActions(useInformationStore, ["setServerData"]),
        ...mapActions(useVersionStore, ["setVersionData"]),
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
    },
    async mounted() {
        // Initialize gettext
        this.gettext = useGettext();

        // Set the language and available languages
        this.updateLanguage(this.gettext, this.language);
        this.updateAvailableLanguages(this.gettext);

        // Set the theme
        this.updateTheme(this.theme);

        // Get the server data
        const serverData = await this.$axiosRetry<IInformation>("/api/information", {
            disableErrorToast: true,
            disableInfoToast: true,
        });

        this.setServerData(serverData);

        const versionData = await this.$axiosRetry("/api/version", {
            disableErrorToast: true,
            disableInfoToast: true,
        });

        this.setVersionData(versionData);

        this.$loading.unmount();
    },
});
</script>
