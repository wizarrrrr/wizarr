<template>
    <FormKit type="form" v-model="requestForm" @submit="localCreateRequest" :submit-label="__('Add Service')" :submit-attrs="{ wrapperClass: 'flex justify-end' }">
        <FormKit type="text" label="Name" name="name" placeholder="Jellyseerr" validation="required|alpha_spaces:latin" />
        <FormKit type="select" label="Service" name="service" help="Only compatible services will show enabled!" :options="services" validation="required" placeholder="Select a Service" />
        <FormKit type="text" label="API URL" name="url" placeholder="https://jellyseerr.example.com" validation="required|url" />
        <FormKit type="password" label="API Key" name="api_key" placeholder="••••••••" validation="required" />
    </FormKit>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "pinia";
import { useInformationStore } from "@/stores/information";
import { useRequestsStore } from "@/stores/requests";

export default defineComponent({
    name: "RequestForm",
    data() {
        return {
            requestForm: {
                name: "",
                service: "",
                url: "",
                api_key: "",
            },
        };
    },
    computed: {
        services() {
            return [
                {
                    label: "Jellyseerr",
                    value: "jellyseerr",
                    attrs: {
                        disabled: this.settings.server_type !== "jellyfin",
                    },
                },
                {
                    label: "Overseerr",
                    value: "overseerr",
                    attrs: {
                        disabled: this.settings.server_type !== "plex",
                    },
                },
                {
                    label: "Ombi",
                    value: "ombi",
                    attrs: {
                        disabled: false,
                    },
                },
            ];
        },
        ...mapState(useInformationStore, ["settings"]),
    },
    methods: {
        localCreateRequest() {
            this.createRequest(this.requestForm);
            this.$emit("close");
        },
        ...mapActions(useRequestsStore, ["createRequest"]),
    },
});
</script>
@/stores/information
