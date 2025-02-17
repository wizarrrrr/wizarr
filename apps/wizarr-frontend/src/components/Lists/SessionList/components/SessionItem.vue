<template>
    <ItemTemplate icon="fa-clock">
        <template #title>
            <span class="text-lg">{{ browser }} on {{ os }}</span>
            <p class="text-xs truncate text-gray-500 dark:text-gray-400 w-full">
                {{ session.ip }}
            </p>
            <p class="text-xs truncate text-gray-500 dark:text-gray-400 w-full">
                {{ $filter("timeAgo", session.created) }}
            </p>
        </template>

        <template #buttons>
            <div class="flex flex-row space-x-2">
                <button @click="deleteLocalSession" class="bg-red-600 hover:bg-primary_hover focus:outline-none text-white font-medium rounded px-3.5 py-2 text-sm dark:bg-red-600 dark:hover:bg-primary_hover">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </template>
    </ItemTemplate>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useSessionsStore } from "@/stores/sessions";
import { mapActions } from "pinia";

import type { Session } from "@/types/api/sessions";

import ItemTemplate from "../../ItemTemplate.vue";
import browserDetect from "browser-detect";

export default defineComponent({
    name: "SessionItem",
    components: {
        ItemTemplate,
    },
    props: {
        session: {
            type: Object as () => Session,
            required: true,
        },
    },
    computed: {
        browser(): string {
            const browser = browserDetect(this.session.user_agent);
            return this.$filter("firstLetterUppercase", browser.name ?? "Unknown");
        },
        os(): string {
            const browser = browserDetect(this.session.user_agent);
            return this.$filters(["removeVersion", "firstLetterUppercase"], browser.os ?? "Unknown");
        },
    },
    methods: {
        async deleteLocalSession() {
            await this.deleteSession(this.session.id);
        },
        ...mapActions(useSessionsStore, ["deleteSession"]),
    },
});
</script>
