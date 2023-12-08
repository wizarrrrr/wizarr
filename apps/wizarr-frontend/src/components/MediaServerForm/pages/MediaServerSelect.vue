<template>
    <div class="flex flex-col">
        <FormKit type="select" :label="__('Select Media Server')" :options="options" v-model="selected" :classes="{ outer: '!mb-2' }" />
        <FormKit type="button" :label="__('Next')" @click="nextStep" :classes="{ input: '!py-2', wrapper: 'flex justify-end' }" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { EventRecords } from "../MediaServerForm.vue";
import type { Emitter } from "mitt";
import type { SupportedServers } from "@wizarrrr/wizarr-sdk";

export default defineComponent({
    name: "MediaServerSelect",
    props: {
        eventBus: {
            type: Object as () => Emitter<EventRecords>,
            required: true,
        },
    },
    data() {
        return {
            options: [] as { label: string; value: string }[],
            selected: undefined as string | undefined,
        };
    },
    watch: {
        selected() {
            this.eventBus.emit("updateServer", { type: this.selected });
        },
    },
    methods: {
        async loadServerOptions() {
            // Get the media server options
            const response = await this.$axios.get<SupportedServers>("/api/supported-servers").catch((err) => {
                this.$toast.error(this.__("Failed to load media server options"));
                this.$emit("close");
            });

            // Check if we have a response
            if (!response) return;

            // Set the options
            this.options = response.data.map((server) => ({
                label: server.name,
                value: server.slug,
            }));

            // Set the selected option
            if (this.selected === undefined) {
                this.selected = this.options[0].value;
            }

            this.eventBus.emit("getServer", (payload?: Record<string, string>) => {
                if (!payload?.type) return;
                this.selected = payload.type;
            });

            // Stop the please wait
            this.$emit("pleaseWait", false);
        },
        nextStep() {
            // Make sure the user has selected a media server
            if (!this.selected) {
                this.$toast.info(this.__("Please select a media server"));
                return;
            }

            // Go to the next step
            this.$emit("nextStep");
        },
    },
    async beforeMount() {
        await this.loadServerOptions();
    },
});
</script>
