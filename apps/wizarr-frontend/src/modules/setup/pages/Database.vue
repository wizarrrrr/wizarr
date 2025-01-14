<template>
    <div class="flex flex-col w-full text-sm text-gray-800 dark:text-gray-200 pt-2 px-6 pb-6 sm:px-8 sm:pb-8">
        {{ __("Currently Wizarr only supports it's internal SQLite database.") }}
        {{ __("This is a temporary and we are working on adding support for other databases.") }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "DatabaseView",
});
</script>
