<template>
    <aside class="relative hidden md:block" aria-labelledby="sidebar-label">
        <div class="w-full sticky top-6 z-20">
            <!-- User Widget -->
            <UserWidget v-if="!isLoading" :avatar="avatar" :name="name" :title="title" :bio="bio" :location="location" :createdAt="createdAt" />
            <UserWidgetSkeleton v-else />

            <div class="max-w-[30vw] overflow-hidden p-6 mb-6 text-gray-500 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <div class="mb-6">
                    <FormKit
                        id="searchBlogs"
                        @input="(value) => console.log(value)"
                        :classes="{
                            input: { 'focus:ring-0': true },
                            outer: { '!mb-0': true },
                        }"
                        type="search"
                        :placeholder="__('Search') + '...'"
                        prefix-icon="fa-search !text-gray-500" />
                </div>
                <h4 class="mb-6 font-bold text-gray-900 uppercase dark:text-white">Recommended topics</h4>
                <div class="flex flex-wrap">
                    <a href="#" class="bg-primary-100 text-primary-800 text-sm font-medium mr-3 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 mb-3">Technology</a>
                    <a href="#" class="bg-primary-100 text-primary-800 text-sm font-medium mr-3 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 mb-3">Money</a>
                    <a href="#" class="bg-primary-100 text-primary-800 text-sm font-medium mr-3 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 mb-3">Art</a>
                    <a href="#" class="bg-primary-100 text-primary-800 text-sm font-medium mr-3 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 mb-3">Productivity</a>
                    <a href="#" class="bg-primary-100 text-primary-800 text-sm font-medium mr-3 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 mb-3">Psychology</a>
                    <a href="#" class="bg-primary-100 text-primary-800 text-sm font-medium mr-3 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 mb-3">Design</a>
                    <a href="#" class="bg-primary-100 text-primary-800 text-sm font-medium mr-3 px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">Mindfulness</a>
                </div>
            </div>
        </div>
    </aside>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import UserWidget from "./Widgets/UserWidget.vue";
import UserWidgetSkeleton from "./Widgets/UserWidgetSkeleton.vue";

// Props definitions
const props = defineProps<{
    loading: boolean;
    avatar?: string;
    name?: string;
    title?: string;
    bio?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    createdAt?: Date;
}>();

const isLoading = ref<boolean>(true);
watch(props, () => {
    isLoading.value = props.loading;
});
</script>
