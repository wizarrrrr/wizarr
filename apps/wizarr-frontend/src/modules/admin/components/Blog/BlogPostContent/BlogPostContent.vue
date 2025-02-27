<template>
    <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-gray-700 p-6 xl:w-[85%] max-w-none format format-sm sm:format-base lg:format-lg dark:format-invert">
        <div class="flex items-start justify-between mb-3">
            <time class="font-normal text-gray-500 dark:text-gray-400 uppercase" pubdate :datetime="rawDate || ''" :title="rawDateString || ''">{{ rawDateStringWithTime }}</time>
        </div>
        <div class="text-base text-gray-900 dark:text-white">
            <div v-if="content" class="markdown bg-white dark:bg-gray-800">
                <VueMarkdown :source="content" :plugins="plugins" :options="options" />
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
import moment from "moment";

import VueMarkdown from "vue-markdown-render";
import MarkdownItAnchor from "markdown-it-anchor";

import type { Options } from "vue-markdown-render";
import { computed } from "vue";

// Props definitions
const props = defineProps<{
    content: string;
    publishedAt: Date;
}>();

// Computed properties
// 2022-08-03
const rawDate = computed(() => {
    return props.publishedAt ? moment(props.publishedAt).format("YYYY-MM-DD") : null;
});

// August 3rd, 2022
const rawDateString = computed(() => {
    return props.publishedAt ? moment(props.publishedAt).format("MMMM Do, YYYY") : null;
});

// August 3rd, 2022, 2:20am EDT
const rawDateStringWithTime = computed(() => {
    return props.publishedAt ? moment(props.publishedAt).format("MMMM Do, YYYY, h:mma z") : null;
});

// State definitions
const plugins = [MarkdownItAnchor];
const options: Options = {
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
};
</script>
