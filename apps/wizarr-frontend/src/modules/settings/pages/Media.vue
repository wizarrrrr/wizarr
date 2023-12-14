<template>
    <ServerList />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ServerList from "@/components/Lists/ServerList/ServerList.vue";

export default defineComponent({
    name: "MediaServerView",
    components: {
        ServerList,
    },
    data() {
        return {};
    },
});
</script>
