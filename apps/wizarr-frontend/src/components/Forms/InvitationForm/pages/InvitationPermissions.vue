<template>
    <div id="invitationPermissions" ref="invitationPermissions" class="w-full">
        <FormKit type="form" :actions="false" v-model="localInvitationData" :disabled="disabled">
            <!-- Select Duration -->
            <FormKit type="select" :label="__('User Account Duration')" :help="__('Duration the invitees account exists for')" name="duration" :options="durationOptions" />

            <!-- Custom Duration -->
            <FormKit type="datepicker" v-if="invitationData.duration == 'custom'" format="DD/MM/YYYY HH:mm" :sequence="['year', 'month', 'day', 'time']" :min-date="new Date()" :label="__('Custom Duration')" name="customDuration" />

            <!-- SELECT SPECIFIC LIBRARIES -->
            <FormKit type="dropdown" :label="__('Select Libraries')" :placeholder="__('Select Libraries')" :help="__('Leave empty to use all libraries')" name="libraries" :options="libraryOptions" multiple selection-appearance="tags" wrapper-class="mb-2" />

            <hr class="border-gray-200 dark:border-gray-700 py-2 mt-3" />

            <!-- Select Options -->
            <FormKit type="checkbox" name="options" :options="checkboxOptions" />
        </FormKit>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useServerStore } from "@/stores/servers";
import { useLibrariesStore } from "@/stores/libraries";

import type { InvitationData } from "../InvitationForm.vue";
import type { Emitter, EventType } from "mitt";
import { useResizeObserver } from "@vueuse/core";

export default defineComponent({
    name: "InvitationPermissions",
    props: {
        eventBus: {
            type: Object as () => Emitter<Record<EventType, unknown>>,
            required: true,
        },
        invitationData: {
            type: Object as () => InvitationData,
            required: true,
        },
    },
    data() {
        return {
            localInvitationData: this.invitationData,
            disabled: false,
            durationOptions: [
                {
                    label: "Unlimited",
                    value: "unlimited",
                },
                {
                    label: "1 Day",
                    value: new Date(Date.now() + 86400000),
                },
                {
                    label: "1 Week",
                    value: new Date(Date.now() + 604800000),
                },
                {
                    label: "1 Month",
                    value: new Date(Date.now() + 2628000000),
                },
                {
                    label: "6 Months",
                    value: new Date(Date.now() + 15768000000),
                },
                {
                    label: "1 Year",
                    value: new Date(Date.now() + 31536000000),
                },
                {
                    label: "Custom",
                    value: "custom",
                },
            ],
            options: {
                jellyfin: {
                    unlimited: {
                        label: "Invitation can be used unlimited times",
                        value: "unlimited",
                    },
                },
                plex: {
                    unlimited: {
                        label: "Invitation can be used unlimited times",
                        value: "unlimited",
                    },
                    plex_home: {
                        label: "Allow invitee access to Plex Home",
                        value: "plex_home",
                    },
                    plex_allow_sync: {
                        label: "Allow invitee to download media",
                        value: "plex_allow_sync",
                    },
                },
            },
        };
    },
    computed: {
        checkboxOptions() {
            const server = this.getServerById(this.invitationData.serverId);
            if (server?.type && server.type in this.options) {
                return Object.values(this.options[server.type as "jellyfin" | "plex"]);
            }
        },
        libraryOptions(): { label: string; value: string }[] {
            const serverLibraries = this.getLibrariesByServerId(this.invitationData.serverId);
            return serverLibraries.map((library) => {
                return {
                    label: library.name,
                    value: library.id,
                };
            });
        },
        ...mapState(useServerStore, ["servers", "getServerById"]),
        ...mapState(useLibrariesStore, ["libraries", "getLibrariesByServerId"]),
    },
    methods: {
        resizeObserver() {
            return new Promise(() => {
                const invitationPermissions = this.$refs.invitationPermissions as HTMLElement;
                invitationPermissions.style.width = invitationPermissions.parentElement?.clientWidth + "px";

                useResizeObserver(invitationPermissions.parentElement, (entry) => {
                    invitationPermissions.style.width = entry[0].contentRect.width + "px";
                });
            });
        },
    },
    watch: {
        localInvitationData: {
            handler() {
                this.$emit("updateInvitationData", this.localInvitationData);
            },
            immediate: false,
            deep: true,
        },
    },
    async mounted() {
        this.resizeObserver().catch(() => console.log);
    },
});
</script>
