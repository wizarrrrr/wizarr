<template>
    <ServerList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MediaServerForm from "@/components/MediaServerForm/MediaServerForm.vue";
import ServerList from "@/components/Lists/ServerList/ServerList.vue";

export default defineComponent({
    name: "MediaServerView",
    components: {
        ServerList,
    },
    data() {
        return {};
    },
    methods: {
        async openMediaServerForm() {
            await this.$modal.openModal(MediaServerForm, {
                title: this.__("Add Media Server"),
                disableFooter: true,
                size: "md",
            });
        },
    },
});
</script>
