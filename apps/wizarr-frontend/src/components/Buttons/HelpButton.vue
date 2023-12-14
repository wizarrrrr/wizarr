<template>
    <button class="text-gray-500 dark:text-gray-400 focus:outline-none text-sm" type="button" @click="help">
        <div class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 hover:dark:bg-gray-700">
            <i class="fa-solid fa-lg fa-circle-info" style="font-size: 15px"></i>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "HelpButton",
    methods: {
        async help() {},
    },
});
</script>
