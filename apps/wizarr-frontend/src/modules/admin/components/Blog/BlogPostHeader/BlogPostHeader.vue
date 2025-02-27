<template>
    <header v-if="cover" :style="{ backgroundImage: `url('${cover}')` }" class="bg-fixed w-full h-[400px] bg-no-repeat bg-cover bg-top bg-blend-darken relative">
        <!-- Gradient Overlay (Supports Light and Dark Mode) -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-gray-100/20 to-gray-100/100 dark:via-gray-900/50 dark:to-gray-900/100"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#99999924] dark:from-[#111827e0] to-transparent"></div>

        <!-- Header content -->
        <div class="w-full mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 absolute top-16 left-1/2 -translate-x-1/2">
            <!-- Tags for Article -->
            <span class="block mb-4 text-gray-300 flex flex-row gap-1">
                <router-link v-for="(tag, index) in tags" :key="index" :to="`/admin/blog?tag=${tag.title.toLowerCase()}`" class="text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                    {{ tag.title }}
                </router-link>
            </span>
            <!-- Title for Article-->
            <h1 class="mb-4 max-w-4xl text-2xl font-extrabold leading-none text-white sm:text-3xl lg:text-4xl line-clamp-2 md:line-clamp-0">{{ header }}</h1>
            <!-- Sub Title for Article-->
            <p class="max-w-[70%] text-lg font-normal text-gray-300 line-clamp-2 md:line-clamp-0">{{ subheader }}</p>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";

const props = defineProps<{
    cover?: string;
    tags?: Array<{
        title: string;
    }>;
    header?: string;
    subheader?: string;
}>();

const isCover = computed(() => !!props.cover);
</script>
