<template>
    <AdminTemplate :header="__('Invited Users')" :subheader="__('Manage your media server users')" :box-view="false">
        <template #header>
            <FormKit id="scanUsers" type="button" :prefix-icon="buttonWait ? 'fa-spinner fa-spin' : 'fa-binoculars'" :disabled="buttonWait" @click="localScanUsers" :classes="{ input: '!bg-secondary' }">
                {{ __("Scan Users") }}
            </FormKit>
        </template>
        <template #default>
            <UserList id="userList" />
        </template>
    </AdminTemplate>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useThemeStore } from "@/stores/theme";
import { mapState } from "pinia";

import AdminTemplate from "@/templates/AdminTemplate.vue";
import UserList from "../components/Users/UserList/UserList.vue";

export default defineComponent({
    name: "UsersView",
    components: {
        AdminTemplate,
        UserList,
    },
    data() {
        return {
            buttonWait: false,
        };
    },
    methods: {
        async localScanUsers() {
            this.$axios.get("/api/users/scan").then(() => {
                this.$toast.info(this.__("Dispatched scan users task"));
            });
        },
    },
    computed: {
        ...mapState(useThemeStore, ["boxView"]),
    },
});
</script>
