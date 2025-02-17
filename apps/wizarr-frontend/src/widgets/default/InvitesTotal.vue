<template>
    <DefaultWidget :title="__('Total Invitations')" :value="count" icon="fa-envelope" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useInvitationStore } from "@/stores/invitations";
import { mapState, mapActions } from "pinia";

import DefaultWidget from "@/widgets/templates/DefaultWidget.vue";

export default defineComponent({
    name: "InvitesTotal",
    components: {
        DefaultWidget,
    },
    computed: {
        count() {
            return String(this.invitations.length);
        },
        ...mapState(useInvitationStore, ["invitations"]),
    },
    methods: {
        ...mapActions(useInvitationStore, ["getInvitations"]),
    },
    created() {
        this.getInvitations();
    },
});
</script>
