<template>
    <DefaultWidget :title="__('Total Users')" :value="count" icon="fa-user" class="p-4" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "pinia";
import { useUsersStore } from "@/stores/users";

import DefaultWidget from "@/widgets/templates/DefaultWidget.vue";

export default defineComponent({
    name: "UsersTotal",
    components: {
        DefaultWidget,
    },
    computed: {
        count() {
            return String(this.users.length);
        },
        ...mapState(useUsersStore, ["users"]),
    },
    methods: {
        ...mapActions(useUsersStore, ["getUsers"]),
    },
    created() {
        this.getUsers();
    },
});
</script>
