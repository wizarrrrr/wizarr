<template>
    <div class="relative flex flex-col">
        <WarningAlert text="Type for server cannot be changed once created" />
        <FormKit type="form" :submit-label="__('Save Connection')" :submit-attrs="{ inputClass: '!py-2', wrapperClass: 'flex justify-end' }" @submit="saveConnection">
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
        </FormKit>
        <a class="absolute bottom-1 left-1 font-medium hover:underline text-sm text-gray-500 dark:text-gray-400" @click="$help('EditServerConnection')">
            {{ __("View Help") }}
        </a>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import WarningAlert from "@/components/Alerts/WarningAlert.vue";

import type { Server as IServer } from "@wizarrrr/wizarr-sdk";

export default defineComponent({
    name: "ServerConnection",
    components: {
        WarningAlert,
    },
    props: {
        server: {
            type: Object as () => IServer,
            required: true,
        },
    },
    data() {
        return {
            localServer: { ...this.server },
        };
    },
    methods: {
        async saveConnection() {
            const data: Partial<IServer> = {
                host: this.localServer.host,
                apiKey: this.localServer.apiKey,
            };

            const response = await this.$axios.put<IServer>(`/api/servers/${this.localServer.id}`, data).catch((err) => {
                this.$toast.error(this.__("Failed to save server connection"));
            });

            if (!response) return;

            this.$toast.success(this.__("Successfully saved server connection"));
        },
    },
});
</script>
