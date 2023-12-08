<template>
    <div class="flex flex-col">
        <h2 class="font-bold text-gray-900 dark:text-white">{{ __("Server Created") }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ __("You have successfully added your media server to Wizarr!") }}</p>
        <FormKit type="button" @click="$emit('close')" :label="__('View Servers')" :classes="{ outer: 'mt-3', input: '!py-2', wrapper: 'flex justify-start' }" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { EventRecords } from "../MediaServerForm.vue";
import type { Emitter } from "mitt";

export default defineComponent({
    name: "MediaServerComplete",
    props: {
        eventBus: {
            type: Object as () => Emitter<EventRecords>,
            required: true,
        },
    },
    data() {
        return {
            server: {
                name: "",
                description: "",
                type: "",
            },
        };
    },
    beforeMount() {
        this.eventBus.emit("getServer", (payload?: Record<string, string>) => {
            this.server = { ...this.server, ...payload };
        });
    },
});
</script>
