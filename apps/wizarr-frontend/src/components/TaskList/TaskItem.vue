<template>
    <ListItem :class="{ 'inner-border inner-border-red-600 inner-border-[2px]': failedTask, 'inner-border inner-border-yellow-600 inner-border-[2px]': isPaused }" icon="fa-list">
        <template #title>
            <span class="text-lg">{{ $filters(["underscroreSpaces", "titleCase"], task.name) }}</span>
            <p class="text-xs truncate text-gray-500 dark:text-gray-400 w-full">{{}}</p>
        </template>

        <template #buttons>
            <div class="flex flex-row space-x-2">
                <button class="bg-secondary hover:bg-secondary_hover focus:outline-none text-white font-medium rounded px-3.5 py-2 text-sm dark:bg-secondary dark:hover:bg-secondary_hover">
                    <i class="fa-solid fa-edit"></i>
                </button>
            </div>
        </template>
    </ListItem>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTasksStore } from "@/stores/tasks";
import { mapActions } from "pinia";

import type { Task } from "@/types/api/tasks";

import ListItem from "../ListItem.vue";

export default defineComponent({
    name: "TaskItem",
    components: {
        ListItem,
    },
    props: {
        task: {
            type: Object as () => Task,
            required: true,
        },
    },
    data() {
        return {
            localTask: this.task || undefined,
            countdown: "Pending",
            failedTask: false,
            isPaused: false,
            intervals: [] as number[],
        };
    },
    methods: {
        ...mapActions(useTasksStore, ["getTask"]),
    },
    async mounted() {
        const task = await this.getTask(this.task.name);
        if (task == undefined) return;
        this.localTask = task;
        this.isPaused = task.isPaused;
    },
});
</script>
