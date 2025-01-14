<template>
    <div class="flex flex-col">
        <FormKit type="form" :submit-label="__('Next')" :submit-attrs="{ inputClass: '!py-2', wrapperClass: 'flex justify-end' }" @submit="nextStep">
            <!-- 
                FormKit Name Text Input
                Server name to identify the server
             -->
            <FormKit
                name="name"
                type="text"
                v-model="server.name"
                :label="__('Server Name')"
                :placeholder="
                    __('%{s} Server', {
                        s: server.type.charAt(0).toUpperCase() + server.type.slice(1),
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
                v-model="server.description"
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
            <a class="absolute bottom-1 left-1 text-sm text-gray-500 dark:text-gray-400" @click="prevStep">{{ __("Back") }}</a>
        </FormKit>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { EventRecords } from "../ServerForm.vue";
import type { Emitter } from "mitt";

export default defineComponent({
    name: "MediaServerInformation",
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
    methods: {
        async nextStep({ name, description }: Record<string, string>) {
            // Update the server
            this.eventBus.emit("updateServer", {
                name: name,
                description: description,
            });

            // Go to the next step
            this.$emit("nextStep");
        },
        async prevStep() {
            // Update the server
            this.eventBus.emit("updateServer", {
                name: this.server.name,
                description: this.server.description,
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
