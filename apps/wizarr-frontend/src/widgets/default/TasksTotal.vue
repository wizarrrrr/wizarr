<template>
    <DefaultWidget :title="__('Total Tasks')" :value="count" icon="fa-server" class="p-4" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTasksStore } from "@/stores/tasks";
import { mapState, mapActions } from "pinia";

import DefaultWidget from "@/widgets/templates/DefaultWidget.vue";

export default defineComponent({
    name: "TasksTotal",
    components: {
        DefaultWidget,
    },
    computed: {
        count() {
            return String(this.tasks.length);
        },
        ...mapState(useTasksStore, ["tasks"]),
    },
    methods: {
        ...mapActions(useTasksStore, ["getTasks"]),
    },
    created() {
        this.getTasks();
    },
});
</script>
