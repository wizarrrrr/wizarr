<template>
    <div class="flex flex-col w-full text-sm text-gray-800 dark:text-gray-200 max-h-[50vh] overflow-y-scroll mt-2 shadowbox">
        <Transition name="fade" mode="out-in" :duration="{ enter: 200, leave: 200 }">
            <div class="markdown pt-5 px-6 pb-6 sm:px-8 sm:pb-8 bg-white dark:bg-gray-800" style="z-index: -100">
                <VueMarkdown :source="markdown" :plugins="plugins" :options="options" />
            </div>
        </Transition>
    </div>
</template>

<style lang="scss">
.dark {
    .shadowbox {
        box-shadow: inset 0 20px 20px 15px rgb(31, 41, 55);
        z-index: 100;
    }
}
.light {
    .shadowbox {
        box-shadow: inset 0 20px 20px 15px rgb(255, 255, 255);
        z-index: 100;
    }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

import VueMarkdown from "vue-markdown-render";
import MarkdownItAnchor from "markdown-it-anchor";
import DefaultNavBar from "@/templates/Navbars/DefaultNavBar.vue";
import EULA from "../../../docs/EULA.md";
import type { Options } from "vue-markdown-render";

export default defineComponent({
    name: "EULAView",
    components: {
        DefaultNavBar,
        VueMarkdown,
    },
    data() {
        return {
            markdown: EULA,
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
});
</script>
