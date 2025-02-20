<template>
    <button type="button" @click="$help('Home')" class="relative rounded-full text-gray-400 hover:text-white">
        <span class="sr-only">View help</span>
        <ExclamationCircleIcon class="size-5" aria-hidden="true" />
    </button>
</template>

<script lang="ts" setup>
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";
</script>
