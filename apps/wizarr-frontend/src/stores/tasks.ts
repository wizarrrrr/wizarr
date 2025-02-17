import type { Tasks, Task } from "@/types/api/tasks";
import { defineStore } from "pinia";

interface TasksStoreState {
    tasks: Task[];
}

export const useTasksStore = defineStore("tasks", {
    state: (): TasksStoreState => ({
        tasks: [],
    }),
    actions: {
        async getTasks() {
            // Fetch tasks from the API
            const tasks = await this.$axios.get<Tasks, { data: Tasks }>("/api/queues").catch((err) => {
                this.$toast.error("Could not get tasks");
                return null;
            });

            // Stop if the API call fails
            if (tasks === null) return;

            // Update existing tasks with the latest data
            this.tasks.forEach((task, index) => {
                const updatedTask = tasks.data.queues.find((newTask: Task) => newTask.name === task.name);
                if (updatedTask) this.tasks[index] = updatedTask;
            });

            // Add new tasks that are not already in the store
            tasks.data.queues.forEach((task: Task) => {
                if (!this.tasks.find((existingTask) => existingTask.name === task.name)) {
                    this.tasks.push(task);
                }
            });

            // Remove tasks that no longer exist in the API response
            this.tasks = this.tasks.filter((task) => tasks.data.queues.some((newTask: Task) => newTask.name === task.name));
        },
        async getTask(name: string) {
            // Fetch a specific task by name from the API
            const tasks = await this.$axios.get<Tasks, { data: Tasks }>(`/api/queues?activeQueue=${name}&status=latest`).catch((err) => {
                this.$toast.error("Could not get tasks");
                return null;
            });

            // Filter to find specific task we are looking for
            const task = tasks?.data.queues.find((existingTask) => existingTask.name === name);

            // Stop if the API call fails
            if (task === undefined) return;

            // Update the task if it already exists in the store
            const existingTaskIndex = this.tasks.findIndex((existingTask) => existingTask.name === name);
            if (existingTaskIndex >= 0) {
                this.tasks[existingTaskIndex] = task;
            } else {
                // Add the task to the store if it doesn't already exist
                this.tasks.push(task);
            }

            // Return the fetched task
            return task;
        },
    },
    persist: true,
});
