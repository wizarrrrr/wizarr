<template>
    <SessionList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SessionList from "@/components/Lists/SessionList/SessionList.vue";

export default defineComponent({
    name: "SessionsView",
    components: {
        SessionList,
    },
});
</script>
