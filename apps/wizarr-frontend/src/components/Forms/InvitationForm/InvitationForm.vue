<template>
    <div>
        <InvitationInformation v-if="currentComponent === 'InvitationInformation'" v-bind="attrs" />
        <InvitationPermissions v-else-if="currentComponent === 'InvitationPermissions'" v-bind="attrs" />
        <InvitationComplete v-else-if="currentComponent === 'InvitationComplete'" v-bind="attrs" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { customAlphabet } from "nanoid";
import { mapState, mapActions } from "pinia";
import { useServerStore } from "@/stores/servers";
import { useLibrariesStore } from "@/stores/libraries";
import { useInvitationStore } from "@/stores/invitations";

import moment from "moment";

import InvitationInformation from "./pages/InvitationInformation.vue";
import InvitationPermissions from "./pages/InvitationPermissions.vue";
import InvitationComplete from "./pages/InvitationComplete.vue";

import type { Emitter } from "mitt";
import type { Invitation as IInvitation, InvitationRequest as IInvitationRequest } from "@wizarrrrr/wizarr-sdk";

export interface InvitationData {
    serverId: string;
    inviteCode: string;
    expiration: Date | null | "custom";
    customExpiration: string;
    options: string[];
    duration: number | "unlimited" | "custom";
    customDuration: string;
    libraries: string[];
}

export default defineComponent({
    name: "InvitationForm",
    components: {
        InvitationInformation,
        InvitationPermissions,
        InvitationComplete,
    },
    props: {
        eventBus: {
            type: Object as () => Emitter<Record<any, any>>,
            required: true,
        },
    },
    data() {
        return {
            currentComponent: "InvitationInformation",
            invitationData: {
                serverId: "",
                inviteCode: customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789")(6),
                expiration: new Date(Date.now() + 86400000) as Date | null | "custom",
                customExpiration: "" as string,
                options: [] as string[],
                duration: "unlimited" as number | "unlimited" | "custom",
                customDuration: "" as string,
                libraries: [] as string[],
            },
        };
    },
    computed: {
        expiration(): IInvitationRequest["expiresAt"] {
            if (this.invitationData.expiration === "custom") {
                return moment(this.invitationData.customExpiration).utc().toDate();
            }

            if (this.invitationData.expiration === null) {
                return null;
            }

            return moment(this.invitationData.expiration).utc().toDate();
        },
        duration(): IInvitationRequest["durationAt"] {
            if (this.invitationData.duration === "custom") {
                return moment(this.invitationData.customDuration).utc().toDate();
            }

            if (this.invitationData.duration === "unlimited") {
                return null;
            }

            return moment(this.invitationData.duration).utc().toDate();
        },
        attrs() {
            return {
                onUpdateInvitationData: this.updateInvitationData,
                onUpdateCurrentComponent: this.updateCurrentComponent,
                invitationData: this.invitationData,
                eventBus: this.eventBus,
            };
        },
        ...mapState(useServerStore, ["servers", "getServerById"]),
    },
    methods: {
        resetInvitationData() {
            this.invitationData = {
                serverId: this.invitationData.serverId,
                inviteCode: customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789")(6),
                expiration: new Date(Date.now() + 86400000),
                customExpiration: "",
                options: [],
                duration: "unlimited",
                customDuration: "",
                libraries: [],
            };
        },
        updateInvitationData(data: InvitationData) {
            this.invitationData = { ...this.invitationData, ...data };
        },
        updateCurrentComponent(component: string) {
            this.currentComponent = component;
        },
        async localCreateInvitation() {
            await this.createInvitation({
                server: this.invitationData.serverId,
                code: this.invitationData.inviteCode,
                libraries: this.invitationData.libraries,
                durationAt: this.duration,
                expiresAt: this.expiration,
                unlimited: this.invitationData.options.includes("unlimited"),
            });

            this.updateCurrentComponent("InvitationComplete");
        },
        ...mapActions(useLibrariesStore, ["getLibraries"]),
        ...mapActions(useInvitationStore, ["createInvitation"]),
    },
    watch: {
        "invitationData.serverId": {
            immediate: true,
            handler() {
                this.invitationData.libraries = [];
            },
        },
        currentComponent: {
            immediate: true,
            handler() {
                if (this.currentComponent === "InvitationInformation") {
                    this.$emit("updateOptions", {
                        title: this.__("Create Invitation"),
                        buttons: [
                            {
                                text: this.__("Create Invitation"),
                                onClick: () => {
                                    this.localCreateInvitation();
                                },
                                attrs: {
                                    disabled: this.servers.length === 0,
                                },
                            },
                        ],
                    });
                }

                if (this.currentComponent === "InvitationPermissions") {
                    this.$emit("updateOptions", {
                        title: this.__("Invitation Permissions"),
                        buttons: [
                            {
                                text: this.__("Back"),
                                onClick: () => {
                                    this.updateCurrentComponent("InvitationInformation");
                                },
                            },
                        ],
                    });
                }

                if (this.currentComponent === "InvitationComplete") {
                    this.$emit("updateOptions", {
                        title: this.__("Invitation Created"),
                        buttons: [
                            {
                                text: this.__("Create Another"),
                                onClick: () => {
                                    this.resetInvitationData();
                                    this.updateCurrentComponent("InvitationInformation");
                                },
                            },
                        ],
                    });
                }
            },
        },
    },
    async beforeMount() {
        if (this.servers.length <= 0) {
            this.$toast.error(this.__("You need to add a server before you can create an invitation"));
            return;
        }

        this.invitationData.serverId = this.servers[0].id;
        await this.getLibraries();
    },
});
</script>
