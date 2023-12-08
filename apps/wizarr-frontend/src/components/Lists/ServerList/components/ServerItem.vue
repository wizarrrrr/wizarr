<template>
    <ItemTemplate>
        <template #title>
            <span class="text-lg">{{ server.name }}</span>
            <p class="text-xs truncate text-gray-500 dark:text-gray-400 w-full">
                {{ $filter("timeAgo", server.createdAt) }}
            </p>
        </template>
    </ItemTemplate>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Server as IServer } from "@wizarrrr/wizarr-sdk";

import ItemTemplate from "../../ItemTemplate.vue";

export default defineComponent({
    name: "ServerItem",
    props: {
        server: {
            type: Object as () => IServer,
            required: true,
        },
    },
    components: {
        ItemTemplate,
    },
});
</script>
