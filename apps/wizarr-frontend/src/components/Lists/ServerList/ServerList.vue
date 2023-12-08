<template>
    <div class="flex flex-col">
        <div class="flex flex-col mb-4">
            <h2 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-200">{{ __("Media Servers") }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                <template v-if="servers.length > 0">
                    {{ __("You can drag and drop the servers to reorder them.") }}
                </template>
                <template v-else>
                    {{ __("You haven’t added any servers yet, get started by adding a Media Server to Wizarr.") }}
                </template>
            </p>
        </div>
        <template v-if="servers.length > 0">
            <Draggable v-model="servers" tag="ul" group="servers" ghost-class="moving-card" :animation="200" item-key="id">
                <template #item="{ element }">
                    <li class="mb-2">
                        <ServerItem :server="element" />
                    </li>
                </template>
            </Draggable>
        </template>
        <template v-else>
            <ServersEmpty />
        </template>
        <div class="fixed right-6 bottom-6 group">
            <FormKit type="button" :classes="{ input: '!w-14 !h-14' }" @click="openMediaServerForm">
                <i class="fas fa-plus text-xl transition-transform group-hover:rotate-45"></i>
            </FormKit>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useServerStore } from "@/stores/servers";
import { mapActions, mapWritableState } from "pinia";

import Draggable from "vuedraggable";
import ServerItem from "./components/ServerItem.vue";
import ServersEmpty from "./components/ServersEmpty.vue";
import MediaServerForm from "@/components/MediaServerForm/MediaServerForm.vue";

export default defineComponent({
    name: "ServerList",
    components: {
        Draggable,
        ServerItem,
        ServersEmpty,
    },
    computed: {
        ...mapWritableState(useServerStore, ["servers"]),
    },
    methods: {
        ...mapActions(useServerStore, ["getServers"]),
        async openMediaServerForm() {
            await this.$modal.openModal(MediaServerForm, {
                title: this.__("Add Media Server"),
                disableFooter: true,
                size: "md",
            });
        },
    },
    async mounted() {
        await this.getServers();
    },
});
</script>
