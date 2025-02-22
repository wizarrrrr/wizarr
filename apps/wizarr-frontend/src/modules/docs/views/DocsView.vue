<template>
    <!-- Navbar -->
    <NavigationBar :hideComponents="['MOBILE_NAVIGATION']" :button="{ label: 'Exit', 'data-theme': 'primary', onClick: closeWindow }" />

    <!-- Page Content -->
    <div id="content" class="pt-[64px] mb-6 md:px-6">
        <div class="container mx-auto px-6 md:px-0 text-black dark:text-white">
            <div class="markdown">
                <VueMarkdown v-if="markdown" :source="markdown" :plugins="plugins" :options="options" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import VueMarkdown from "vue-markdown-render";
import MarkdownItAnchor from "markdown-it-anchor";
import NavigationBar from "@/templates/NavigationBar.vue";

import type { Options } from "vue-markdown-render";

// Route definitions
const route = useRoute();

// State definitions
const markdown = ref<string | null>(null);
const plugins = [MarkdownItAnchor];
const options: Options = {
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
};

// Method definitions
const closeWindow = () => {
    window.close();
};

// Lifecycle hook for fetching markdown content
onMounted(async () => {
    // Get the page ID from the route
    const pageID = route.params.id as string | undefined;

    // If no page ID is provided, load the README
    if (!pageID) {
        // @ts-ignore
        return await import(`../../../docs/README.md`).then((markdownModule) => {
            markdown.value = markdownModule.default;
        });
    }

    // Attempt to load specific markdown file, fallback to README if not found
    const markdownModule = await import(`../../../docs/${pageID}.md`).catch(async () => {
        // @ts-ignore
        return await import(`../../../docs/README.md`);
    });

    markdown.value = markdownModule.default;
});
</script>
