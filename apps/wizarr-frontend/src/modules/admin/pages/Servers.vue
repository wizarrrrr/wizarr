<template>
    <AdminTemplate :header="__('Manage Servers')" :subheader="__('Manage your remote servers')" :box-view="false">
        <template #header>
            <FormKit id="createInvitation" type="button" @click="openServerForm" :classes="{ input: '!bg-secondary' }">
                {{ __("Add Server") }}
            </FormKit>
        </template>
        <template #default>
            <ServerList :hide-add-button="true" />
        </template>
    </AdminTemplate>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useThemeStore } from "@/stores/theme";

import AdminTemplate from "@/templates/AdminTemplate.vue";
import ServerList from "@/components/Lists/ServerList/ServerList.vue";
import ServerForm from "@/components/Forms/ServerForm/ServerForm.vue";

export default defineComponent({
    name: "ServersView",
    components: {
        ServerList,
        AdminTemplate,
    },
    data() {
        return {};
    },
    methods: {
        async openServerForm() {
            await this.$modal.openModal(ServerForm, {
                title: this.__("Add Media Server"),
                disableFooter: true,
                size: "md",
            });
        },
    },
    computed: {
        ...mapState(useThemeStore, ["boxView"]),
    },
});
</script>
