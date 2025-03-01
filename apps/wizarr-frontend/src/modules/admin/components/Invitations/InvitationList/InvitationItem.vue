<template>
    <ListItem icon="fa-envelope">
        <template #title>
            <button @click="copyToClipboard()" class="text-lg">
                {{ invite.code }}
            </button>
            <p v-if="invite.used" class="text-xs truncate w-full" :class="usedColor">
                {{ __("Invitation Used") }}
            </p>
            <p v-else-if="invite.expiresAt" class="text-xs truncate w-full" :class="expireColor">
                {{ expired }}
            </p>
            <p class="text-xs truncate text-gray-500 dark:text-gray-400 w-full">
                {{ $filter("timeAgo", invite.createdAt) }}
            </p>
        </template>
        <template #buttons>
            <div class="flex flex-row space-x-2">
                <FormKit type="button" @click="openShareSheet" :classes="{ input: '!bg-secondary !px-3.5 h-[36px]' }">
                    <i class="fa-solid fa-share"></i>
                </FormKit>
                <FormKit v-if="invite.used && invite.used && invite.users.length > 0" type="button" @click="openInvitationUserList" :classes="{ input: '!bg-secondary !px-3.5 h-[36px]' }">
                    <i class="fa-solid fa-user-group"></i>
                </FormKit>
            </div>
            <div class="flex flex-row space-x-2">
                <FormKit type="button" data-theme="secondary" @click="manageInvitation" :classes="{ input: '!bg-secondary !px-3.5 h-[36px]' }">
                    <i class="fa-solid fa-edit"></i>
                </FormKit>
                <FormKit type="button" :disabled="disabled.delete" @click="performDeleteInvitation" :classes="{ input: '!bg-red-600 !px-3.5 h-[36px]' }">
                    <i class="fa-solid fa-trash"></i>
                </FormKit>
            </div>
        </template>
    </ListItem>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useInvitationStore } from "@/stores/invitations";
import { useUsersStore } from "@/stores/users";
import { mapActions, mapState } from "pinia";
import { useClipboard } from "@vueuse/core";

import type { Invitation as IInvitation } from "@wizarrrrr/wizarr-sdk";
import type { CustomModalOptions } from "@/plugins/modal";

import ListItem from "@/components/ListItem.vue";
import SimpleUserList from "../SimpleUserList/SimpleUserList.vue";
import ShareSheet from "../ShareSheet.vue";
import InvitationManager from "../../InvitationManager/InvitationManager.vue";

export default defineComponent({
    name: "InvitationItem",
    components: {
        ListItem,
    },
    props: {
        invite: {
            type: Object as () => IInvitation,
            required: true,
        },
    },
    data() {
        return {
            disabled: {
                delete: false,
            },
            clipboard: useClipboard({
                legacy: true,
            }),
            shareData: {
                title: this.__("Join my media server"),
                text: this.__("I wanted to invite you to join my media server."),
                url: `${window.location.origin}/j/${this.invite.code}`,
            },
        };
    },
    methods: {
        async manageInvitation() {
            const modal_options: CustomModalOptions = {
                title: this.__("Invitation Details"),
                buttons: [
                    {
                        text: this.__("Save"),
                        attrs: {
                            "data-theme": "primary",
                            disabled: true,
                        },
                        emit: "saveInvitation",
                    },
                ],
            };

            const modal_props = {
                invitation: this.invite,
            };

            this.$modal.openModal(InvitationManager, modal_options, modal_props);
        },
        async copyToClipboard() {
            if (this.clipboard.isSupported) {
                this.clipboard.copy(`${window.location.origin}/j/${this.invite.code}`);
                this.$toast.info(this.__("Copied to clipboard"));
            } else {
                this.$toast.error(this.__("Your browser does not support copying to clipboard"));
            }
        },
        async openShareSheet() {
            this.$share(this.shareData, this.openShareModal);
        },
        async openShareModal() {
            const modal_options = {
                title: this.__("Share Invitation"),
                disableFooter: true,
            };

            const modal_props = {
                code: this.invite.code,
            };

            this.$modal.openModal(ShareSheet, modal_options, modal_props);
        },
        async openInvitationUserList() {
            const modal_options = {
                title: this.__("Invitation Users"),
                disableFooter: true,
            };

            const modal_props = {
                users: this.invite.users,
            };

            this.$modal.openModal(SimpleUserList, modal_options, modal_props);
        },
        async localDeleteInvitation() {
            await this.deleteInvitation(this.invite.id);
            this.$toast.success(this.__("Invitation deleted successfully"));
        },
        async performDeleteInvitation(event: MouseEvent) {
            // If the shift key is pressed, delete the invitation without confirmation
            if (event.shiftKey) {
                this.localDeleteInvitation();
                return;
            }

            // Otherwise, confirm the deletion
            if (await this.$modal.confirmModal(this.__("Are you sure?"), this.__("Are you sure you want to delete this invitation?"))) {
                this.localDeleteInvitation();
            }
        },
        ...mapActions(useInvitationStore, ["deleteInvitation"]),
    },
    computed: {
        expired(): string {
            if (this.$filter("isPast", this.invite.expiresAt)) {
                return this.__("Expired %{s}", {
                    s: this.$filter("timeAgo", this.invite.expiresAt),
                });
            } else {
                return this.__("Expires %{s}", {
                    s: this.$filter("timeAgo", this.invite.expiresAt),
                });
            }
        },
        usedColor() {
            if (this.invite.used && this.invite.unlimited) {
                return "text-yellow-500 dark:text-yellow-400";
            }

            if (this.invite.used) {
                return "text-red-600 dark:text-red-500";
            }
        },
        expireColor() {
            const inHalfDay = new Date();
            inHalfDay.setHours(inHalfDay.getHours() + 12);

            if (this.$filter("isPast", this.invite.expiresAt)) {
                return "text-red-600 dark:text-red-500";
            }

            if (this.$filter("dateLess", this.invite.expiresAt, inHalfDay)) {
                return "text-yellow-500 dark:text-yellow-400";
            }

            return "text-gray-500 dark:text-gray-400";
        },
        ...mapState(useUsersStore, ["users"]),
    },
});
</script>
