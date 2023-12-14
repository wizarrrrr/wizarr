<template>
    <div>
        <FormKit type="form" :actions="false" v-model="localInvitationData" :disabled="disabled">
            <div class="space-y-4">
                <!-- Select Server -->
                <FormKit type="select" :label="__('Select Server')" name="serverId" :options="serverOptions" />

                <!-- Invite Code -->
                <FormKit
                    name="inviteCode"
                    type="inputButton"
                    :placeholder="__('XMFGEJI')"
                    :label="__('Invitation Code')"
                    :validation="[['required'], ['matches', /^[a-zA-Z0-9]+$/], ['length', 6, 6]]"
                    :validation-messages="{
                        required: __('Please enter an invitation code'),
                        matches: __('Please only use letters and numbers'),
                        length: __('Please enter an invitation code that is 6 characters long'),
                    }"
                    @button="refreshCode">
                    <i class="fa-solid fa-random" slot="button"></i>
                </FormKit>

                <!-- Select Expiration -->
                <FormKit type="select" :label="__('Invitation Expiration')" name="expiration" :options="expirationOptions" />

                <!-- Custom Expiration -->
                <FormKit type="datepicker" v-if="invitationData.expiration == 'custom'" format="DD/MM/YYYY HH:mm" :sequence="['year', 'month', 'day', 'time']" :min-date="new Date()" :label="__('Custom Expiration')" name="customExpiration" />
            </div>
        </FormKit>

        <!-- ADVANCED OPTIONS -->
        <button @click="showPermissionsView" type="button" class="block text-sm font-medium text-secondary dark:text-primary pt-3">
            {{ __("Advanced Options") }}
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useServerStore } from "@/stores/servers";
import { useLibrariesStore } from "@/stores/libraries";
import { Collapse } from "vue-collapsed";
import { customAlphabet } from "nanoid";

import type { ToastID } from "vue-toastification/dist/types/types";
import type { Emitter, EventType } from "mitt";
import type { InvitationData } from "../InvitationForm.vue";

export default defineComponent({
    name: "InvitationInformation",
    components: {
        Collapse,
    },
    props: {
        eventBus: {
            type: Object as () => Emitter<Record<EventType, unknown>>,
            required: false,
        },
        invitationData: {
            type: Object as () => InvitationData,
            required: true,
        },
    },
    data() {
        return {
            inviteCode: "",
            localInvitationData: this.invitationData,
            disabled: false,
            expirationOptions: [
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
                    label: "Never",
                    value: null,
                },
                {
                    label: "Custom",
                    value: "custom",
                },
            ],
            advancedOptions: false,
            clipboardToast: null as ToastID | null,
        };
    },
    methods: {
        refreshCode() {
            this.localInvitationData.inviteCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789")(6);
        },
        showPermissionsView() {
            this.$emit("updateCurrentComponent", "InvitationPermissions");
        },
    },
    computed: {
        serverOptions() {
            return this.servers.map((server) => {
                return {
                    label: `${server.name} (${server.host})`,
                    value: server.id,
                };
            });
        },
        ...mapState(useServerStore, ["servers", "getServerById"]),
        ...mapState(useLibrariesStore, ["libraries", "getLibrariesByServerId"]),
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
});
</script>
