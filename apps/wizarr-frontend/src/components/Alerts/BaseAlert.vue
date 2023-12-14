<template>
    <div class="flex items-center border-2 p-3 mb-4" :class="classes">
        <i v-if="type === 'danger'" class="fas fa-circle-exclamation"></i>
        <i v-if="type === 'warning'" class="fas fa-triangle-exclamation"></i>
        <i v-if="type === 'success'" class="fa-solid fa-md fa-check-circle"></i>
        <i v-if="type === 'information'" class="fa-solid fa-md fa-info-circle"></i>
        <div class="ms-3 text-sm font-medium">
            <p class="text-sm" v-html="text"></p>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "BaseAlert",
    props: {
        type: {
            type: String as () => "information" | "success" | "warning" | "danger",
            default: "info",
        },
        text: {
            type: String,
            default: "",
        },
        options: {
            type: Object,
            default: () => ({
                rounded: true,
            }),
        },
    },
    computed: {
        colors(): string {
            switch (this.type) {
                case "information":
                    return "text-blue-800 bg-blue-50 dark:bg-transparent dark:text-blue-400";
                case "success":
                    return "text-green-800 bg-green-50 dark:bg-transparent dark:text-green-400";
                case "warning":
                    return "text-yellow-800 bg-yellow-50 dark:bg-transparent dark:text-yellow-400";
                case "danger":
                    return "text-red-800 bg-red-50 dark:bg-transparent dark:text-red-400";
                default:
                    return "text-blue-800 bg-blue-50 dark:bg-transparent dark:text-blue-400";
            }
        },
        borders(): string {
            switch (this.type) {
                case "information":
                    return "border-blue-200 dark:border-blue-800";
                case "success":
                    return "border-green-200 dark:border-green-800";
                case "warning":
                    return "border-yellow-200 dark:border-yellow-800";
                case "danger":
                    return "border-red-200 dark:border-red-800";
                default:
                    return "border-blue-200 dark:border-blue-800";
            }
        },
        classes(): string {
            return `${this.colors} ${this.borders} ${this.options.rounded ? "rounded" : ""}`;
        },
    },
});
</script>
