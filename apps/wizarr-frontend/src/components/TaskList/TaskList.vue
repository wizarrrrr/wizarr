<template>
    <Draggable v-model="tasks" tag="ul" group="jobs" ghost-class="moving-card" :animation="200" item-key="id">
        <template #item="{ element }">
            <li class="mb-2">
                <TaskItem :task="element" />
            </li>
        </template>
    </Draggable>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTasksStore } from "@/stores/tasks";
import { mapActions, mapWritableState } from "pinia";

import Draggable from "vuedraggable";
import TaskItem from "./TaskItem.vue";

export default defineComponent({
    name: "TasksView",
    components: {
        Draggable,
        TaskItem,
    },
    computed: {
        ...mapWritableState(useTasksStore, ["tasks"]),
    },
    methods: {
        ...mapActions(useTasksStore, ["getTasks"]),
    },
    async created() {
        await this.getTasks();
    },
});
</script>
