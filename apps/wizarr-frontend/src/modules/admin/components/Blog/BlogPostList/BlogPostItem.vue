<template>
    <article class="p-6 relative bg-white rounded shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800">
        <div class="flex justify-between items-center mb-5 text-gray-500">
            <span class="flex flex-row gap-1">
                <button v-for="(tag, index) in tags" :key="index" class="text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                    {{ tag.title }}
                </button>
            </span>
            <span class="text-sm">{{ timeAgo }}</span>
        </div>
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
            <router-link :to="link" :title="title">{{ title }}</router-link>
        </h2>
        <p class="mb-5 font-light text-gray-500 dark:text-gray-400 line-clamp-3">{{ description }}</p>
        <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <img class="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 object-cover" :src="authorAvatar" :alt="authorAvatarAlt" />
                <span class="flex flex-col pb-2">
                    <span class="font-medium dark:text-white"> {{ authorName }} </span>
                    <span class="leading-[0.8] font-light text-gray-500 dark:text-gray-400"> {{ authorTitle }} </span>
                </span>
            </div>
            <FormKit :label="__('Read More')" type="button" data-theme="primary" @click="router.push(link)" />
        </div>
    </article>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { useFilter } from "@/plugins/filters";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
    tags: Array<{
        title: string;
    }>;
    publishedAt: Date;
    title: string;
    description: string;
    authorName: string;
    authorTitle: string;
    authorAvatar: string;
    authorAvatarAlt: string;
    link: string;
}>();

const timeAgo = computed(() => {
    return useFilter("timeAgo", props.publishedAt);
});
</script>
