<template>
    <!-- Navbar -->
    <DefaultNavBar :hide-button="true" :show-toggles="true" />

    <!-- Page Content -->
    <div id="content" class="pt-[64px] mb-6 md:px-6">
        <div class="container mx-auto px-6 md:px-0 text-black dark:text-white">
            <div class="markdown">
                <VueMarkdown v-if="markdown" :source="markdown" :plugins="plugins" :options="options" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import VueMarkdown from "vue-markdown-render";
import MarkdownItAnchor from "markdown-it-anchor";
import DefaultNavBar from "@/templates/Navbars/DefaultNavBar.vue";

import type { Options } from "vue-markdown-render";

export default defineComponent({
    name: "DocsView",
    components: {
        DefaultNavBar,
        VueMarkdown,
    },
    data() {
        return {
            markdown: null as string | null,
            plugins: [MarkdownItAnchor],
            options: {
                html: true,
                xhtmlOut: true,
                breaks: true,
                linkify: true,
                typographer: true,
            } as Options,
        };
    },
    async mounted() {
        // Get the page ID from the route
        const pageID = this.$route.params.id as string | undefined;

        // If no page ID is provided, show the README
        if (!pageID) {
            // @ts-ignore
            return await import(`../../../docs/README.md`).then((markdown) => {
                this.markdown = markdown.default;
            });
        }

        const markdown = await import(`../../../docs/${pageID}.md`).catch(async () => {
            // @ts-ignore
            return await import(`../../../docs/README.md`);
        });

        this.markdown = markdown.default;
    },
});
</script>
