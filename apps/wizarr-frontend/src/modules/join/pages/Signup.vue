<template>
    <PlexSignup v-bind="$attrs" v-if="false == 'plex'" />
    <JellyfinSignup v-bind="$attrs" v-else-if="false == 'jellyfin'" />
</template>

<script lang="ts">
import { mapState } from "pinia";
import { defineComponent, defineAsyncComponent } from "vue";
import { useInformationStore } from "@/stores/information";

export default defineComponent({
    name: "CreateAccountView",
    components: {
        PlexSignup: defineAsyncComponent(() => import("./Plex/Signup.vue")),
        JellyfinSignup: defineAsyncComponent(() => import("./Jellyfin/Signup.vue")),
    },
    props: {
        invitation: {
            type: Object,
            required: true,
        },
    },
    created() {
        console.log("DATA: ", this.invitation);
    },
});
</script>
