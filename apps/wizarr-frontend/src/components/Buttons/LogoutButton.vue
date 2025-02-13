<template>
    <button class="text-gray-500 dark:text-gray-400 focus:outline-none text-sm" type="button" @click="logout">
        <div class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 hover:dark:bg-gray-700">
            <i class="fa-solid fa-lg fa-right-from-bracket"></i>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
    name: "LogoutButton",
    methods: {
        ...mapActions(useAuthStore, ["logout"]),
    },
});
</script>
