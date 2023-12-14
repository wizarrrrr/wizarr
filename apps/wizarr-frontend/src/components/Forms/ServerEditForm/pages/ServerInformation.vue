<template>
    <div class="flex flex-col">
        <FormKit type="form" :submit-label="__('Save Information')" :submit-attrs="{ inputClass: '!py-2', wrapperClass: 'flex justify-end' }" @submit="saveInformation">
            <!-- 
                FormKit Name Text Input
                Server name to identify the server
             -->
            <FormKit
                name="name"
                type="text"
                v-model="localServer.name"
                :label="__('Server Name')"
                :placeholder="
                    __('%{s} Server', {
                        s: localServer.type.charAt(0).toUpperCase() + localServer.type.slice(1),
                    })
                "
                :validation="[
                    ['required'], // Required field
                    ['matches', /^[a-zA-Z0-9 ]+$/], // Only letters, numbers and spaces
                    ['length', 3, 32], // Length between 3 and 32 characters
                ]"
                :validation-messages="{
                    required: __('Please enter a name for this server'),
                    matches: __('Please only use letters, numbers and spaces'),
                    length: __('Please enter a name between 3 and 32 characters'),
                }" />
            <!-- 
                FormKit Description Textarea
                Server description describing the server usage
             -->
            <FormKit
                name="description"
                type="textarea"
                v-model="localServer.description"
                :label="__('Server Description')"
                :placeholder="__('Optional description to help you identify this server')"
                :rows="3"
                :validation="[
                    ['matches', /^[a-zA-Z0-9 ]+$/], // Only letters, numbers and spaces
                    ['length', 0, 255], // Length between 0 and 255 characters
                ]"
                :validation-messages="{
                    matches: __('Please only use letters, numbers and spaces'),
                    length: __('Please enter a description between 0 and 255 characters'),
                }" />
        </FormKit>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { Server as IServer } from "@wizarrrr/wizarr-sdk";

export default defineComponent({
    name: "ServerInformation",
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
        async saveInformation() {
            const data: Partial<IServer> = {
                name: this.localServer.name,
                description: this.localServer.description,
            };

            const response = await this.$axios.put<IServer>(`/api/servers/${this.localServer.id}`, data).catch((err) => {
                this.$toast.error(this.__("Failed to update server information"));
            });

            if (!response) return;

            this.$toast.success(this.__("Successfully updated server information"));
        },
    },
});
</script>
