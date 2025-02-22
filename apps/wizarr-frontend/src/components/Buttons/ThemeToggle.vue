<template>
    <button type="button" @click="toggleTheme" class="relative rounded-full text-gray-400 hover:text-black dark:hover:text-white">
        <span class="sr-only">Change theme</span>
        <MoonIcon v-if="theme === LIGHT_VALUE" class="size-5" aria-hidden="true" />
        <SunIcon v-else-if="theme === DARK_VALUE" class="size-5" aria-hidden="true" />
        <ComputerDesktopIcon v-else-if="theme === SYSTEM_VALUE" class="size-5" aria-hidden="true" />
    </button>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";
import { LIGHT_VALUE, DARK_VALUE, SYSTEM_VALUE } from "@/ts/utils/darkMode";
import { MoonIcon, SunIcon, ComputerDesktopIcon } from "@heroicons/vue/24/outline";

// Access the theme store
const themeStore = useThemeStore();

// Get and compute current theme from the store
const theme = computed(() => themeStore.theme);

// Destructure needed actions directly from the store
const { toggleTheme } = themeStore;
</script>
