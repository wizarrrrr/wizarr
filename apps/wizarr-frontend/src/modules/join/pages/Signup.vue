<template>
    <PlexSignup v-bind="$attrs" v-if="serverType == 'plex'" />
    <JellyfinSignup v-bind="$attrs" v-else-if="serverType == 'jellyfin'" />
</template>

<script lang="ts">
import { mapState } from "pinia";
import { defineComponent, defineAsyncComponent } from "vue";
import { useJoinStore } from "@/stores/join";

export default defineComponent({
    name: "CreateAccountView",
    components: {
        PlexSignup: defineAsyncComponent(() => import("./Plex/Signup.vue")),
        JellyfinSignup: defineAsyncComponent(() => import("./Jellyfin/Signup.vue")),
    },
    computed: {
        ...mapState(useJoinStore, ["serverType"]),
    },
});
</script>
