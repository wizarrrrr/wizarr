<template>
    <PlexDownload v-bind="$props" v-if="settings.server_type == 'plex'" @height="$emit('height')" />
    <JellyfinDownload v-bind="$props" v-else-if="settings.server_type == 'jellyfin'" @height="$emit('height')" />
</template>

<script lang="ts">
import { mapState } from "pinia";
import { defineComponent, defineAsyncComponent } from "vue";
import { useInformationStore } from "@/stores/information";

export default defineComponent({
    name: "Download",
    components: {
        PlexDownload: defineAsyncComponent(() => import("./Plex/Download.vue")),
        JellyfinDownload: defineAsyncComponent(() => import("./Jellyfin/Download.vue")),
    },
    computed: {
        ...mapState(useInformationStore, ["settings"]),
    },
});
</script>
@/stores/information
