<template>
    <div class="flex flex-col">
        <div class="flex flex-col mb-4">
            <h2 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-200">{{ __("Media Servers") }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ __("You haven’t added any servers yet. Get started by adding a Media Server to Wizarr.") }}</p>
        </div>
        <button @click="openMediaServerForm" type="button" class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none">
            <svg class="mx-auto h-12 w-12 text-gray-300" stroke="currentColor" viewBox="0 0 30 37.5">
                <g transform="translate(-90 -200)">
                    <path d="M117,216.51V212c0-0.601-0.271-1.133-0.689-1.5c0.419-0.367,0.689-0.899,0.689-1.5v-5c0-1.104-0.896-2-2-2H95    c-1.104,0-2,0.896-2,2v5c0,0.601,0.271,1.133,0.689,1.5C93.271,210.867,93,211.399,93,212v5c0,0.601,0.271,1.133,0.689,1.5    C93.271,218.867,93,219.399,93,220v5c0,1.104,0.896,2,2,2h11.51c1.369,1.818,3.539,3,5.99,3c4.143,0,7.5-3.357,7.5-7.5    C120,220.048,118.818,217.878,117,216.51z M94,209v-5c0-0.551,0.448-1,1-1h20c0.552,0,1,0.449,1,1v5c0,0.551-0.448,1-1,1H95    C94.448,210,94,209.551,94,209z M94,217v-5c0-0.551,0.448-1,1-1h20c0.552,0,1,0.449,1,1v3.869c-1.045-0.553-2.235-0.869-3.5-0.869    c-2.451,0-4.621,1.181-5.99,3H95C94.448,218,94,217.551,94,217z M95,226c-0.552,0-1-0.449-1-1v-5c0-0.551,0.448-1,1-1h10.869    c-0.553,1.045-0.869,2.235-0.869,3.5s0.316,2.455,0.869,3.5H95z M112.5,229c-3.59,0-6.5-2.91-6.5-6.5s2.91-6.5,6.5-6.5    s6.5,2.91,6.5,6.5S116.09,229,112.5,229z" />
                    <polygon points="113,222 113,218 112,218 112,222 108,222 108,223 112,223 112,227 113,227 113,223 117,223 117,222   " />
                </g>
            </svg>
            <span class="mt-2 block text-sm font-semibold text-gray-900 dark:text-gray-200">Add Media Server</span>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MediaServerForm from "@/components/MediaServerForm/MediaServerForm.vue";

export default defineComponent({
    name: "MediaServerView",
    components: {
        MediaServerForm,
    },
    data() {
        return {};
    },
    methods: {
        async openMediaServerForm() {
            await this.$modal.openModal(MediaServerForm, {
                title: this.__("Add Media Server"),
                disableFooter: true,
            });
        },
    },
});
</script>
