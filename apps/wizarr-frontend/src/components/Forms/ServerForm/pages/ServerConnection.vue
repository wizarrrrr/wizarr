<template>
    <div class="flex flex-col">
        <FormKit type="form" :submit-label="__('Next')" :submit-attrs="{ inputClass: '!py-2', wrapperClass: 'flex justify-end' }" @submit="nextStep">
            <!-- 
                FormKit URL Text Input
                Host URL of the media server
             -->
            <FormKit
                name="host"
                type="url"
                v-model="server.host"
                :label="__('Host URL')"
                :placeholder="__('https://%{s}.example.com', { s: server.type })"
                :validation="[['required'], ['url']]"
                :validation-messages="{
                    required: __('Please enter the host URL of your %{s} server', {
                        s: server.type.charAt(0).toUpperCase() + server.type.slice(1),
                    }),
                    url: __('Please enter a valid URL for your %{s} server', {
                        s: server.type.charAt(0).toUpperCase() + server.type.slice(1),
                    }),
                }"
                autocomplete="off" />
            <!-- 
                FormKit URL Text Input
                Host Override URL of the media server
            -->
            <FormKit
                name="hostOverride"
                type="url"
                v-model="server.hostOverride"
                :label="__('Host Override URL')"
                :placeholder="__('https://%{s}.example.com', { s: server.type })"
                :help="__('This is the URL that will be used to access the server. This is useful if you are using a reverse proxy to access the server.')"
                :validation="[['url']]"
                :validation-messages="{
                    url: __('Please enter a valid URL for your %{s} server', {
                        s: server.type.charAt(0).toUpperCase() + server.type.slice(1),
                    }),
                }"
                autocomplete="off" />
            <!-- 
                FormKit API Key Text Input
                API key of the media server
            -->
            <FormKit
                name="apiKey"
                type="text"
                v-model="server.apiKey"
                :label="__('API Key')"
                placeholder="****************"
                :validation="[['required']]"
                :validation-messages="{
                    required: __('Please enter the API key of your %{s} server', {
                        s: server.type.charAt(0).toUpperCase() + server.type.slice(1),
                    }),
                }"
                autocomplete="off" />
            <a class="absolute bottom-1 left-1 text-sm text-gray-500 dark:text-gray-400" @click="prevStep">{{ __("Back") }}</a>
        </FormKit>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { useServerStore } from "@/stores/servers";

import type { EventRecords } from "../ServerForm.vue";
import type { Emitter } from "mitt";

export default defineComponent({
    name: "MediaServerAuthentication",
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
                host: "",
                hostOverride: undefined as string | undefined,
                apiKey: "",
            },
        };
    },
    methods: {
        ...mapActions(useServerStore, ["addServer"]),
        async nextStep() {
            // Update the server
            this.eventBus.emit("updateServer", {
                host: this.server.host,
                hostOverride: this.server.hostOverride,
                apiKey: this.server.apiKey,
            });

            // If no hostOverride is set, remove it from the server object
            const request = this.server;
            if (request.hostOverride == "") delete request.hostOverride;

            // Create the server on the backend
            const response = await this.$axios.post("/api/servers", request).catch((err) => {
                return null;
            });

            // Check if we have a response with status 200
            if (response?.status == 201) {
                this.addServer(response.data);
                this.$emit("nextStep");
                this.$toast.success(
                    this.__("Successfully added %{s} server", {
                        s: this.server.type.charAt(0).toUpperCase() + this.server.type.slice(1),
                    }),
                );
            }
        },
        async prevStep() {
            // Update the server
            this.eventBus.emit("updateServer", {
                host: this.server.host,
                apiKey: this.server.apiKey,
            });

            // Go to the previous step
            this.$emit("prevStep");
        },
    },
    beforeMount() {
        this.eventBus.emit("getServer", (payload?: Record<string, string>) => {
            this.server = { ...this.server, ...payload };
        });
    },
});
</script>
