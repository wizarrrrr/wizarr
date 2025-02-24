<template>
    <AdminTemplate :header="__('Invitations')" :subheader="__('Manage your invitations')" :box-view="false">
        <template #header>
            <FormKit id="createInvitation" type="button" @click="openInviteModal" :classes="{ input: '!bg-secondary' }">
                {{ __("Create Invitation") }}
            </FormKit>
        </template>
        <template #default>
            <InvitationList id="invitationList" />
        </template>
    </AdminTemplate>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useModal } from "@/plugins/modal";

import AdminTemplate from "@/templates/AdminTemplate.vue";
import InvitationForm from "@/components/Forms/InvitationForm/InvitationForm.vue";
import InvitationList from "../components/Invitations/InvitationList/InvitationList.vue";

const inviteModal = ref(false);
const themeStore = useThemeStore();
const boxView = themeStore.boxView;
const modal = useModal();

function openInviteModal() {
    modal.openModal(InvitationForm, {
        title: __("Create Invitation"),
        size: "md",
        buttons: [
            {
                text: __("Create Invitation"),
                emit: "createInvitation",
            },
        ],
    });
}
</script>
