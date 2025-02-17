<template>
    <ItemTemplate :svg-string="icon">
        <template #title>
            <span class="text-lg">{{ server.name }}</span>
            <p class="text-xs truncate text-gray-500 dark:text-gray-400 w-full">
                {{ $filter("timeAgo", server.createdAt) }}
            </p>
        </template>
        <template #buttons>
            <div class="flex flex-row space-x-2">
                <!-- Edit Button -->
                <FormKit type="button" data-size="square" data-theme="secondary" @click="editServer">
                    <i class="fa-solid fa-edit"></i>
                </FormKit>
                <FormKit type="button" data-size="square" data-theme="danger" @click="localDeleteServer">
                    <i class="fa-solid fa-trash"></i>
                </FormKit>
            </div>
        </template>
    </ItemTemplate>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useServerStore } from "@/stores/servers";
import { mapActions } from "pinia";

import ItemTemplate from "../../ItemTemplate.vue";
import ServerEditForm from "@/components/Forms/ServerEditForm/ServerEditForm.vue";

import type { Server as IServer } from "@wizarrrrr/wizarr-sdk";

export default defineComponent({
    name: "ServerItem",
    props: {
        server: {
            type: Object as () => IServer,
            required: true,
        },
    },
    components: {
        ItemTemplate,
    },
    data() {
        return {
            icon: "",
        };
    },
    methods: {
        ...mapActions(useServerStore, ["deleteServer"]),
        async localDeleteServer() {
            const response = await this.$modal.confirmModal(this.__("Delete Server"), this.__("Are you sure you want to delete this server?"));
            if (response) await this.deleteServer(this.server.id);
        },
        async editServer() {
            await this.$modal.openModal(ServerEditForm, {
                title: this.__(`Managing ${this.server.name}`),
                disableFooter: true,
                size: "lg",
                props: {
                    server: this.server,
                },
            });
        },
    },
    async beforeCreate() {
        const icon = await import(`../../../../assets/img/${this.server.type}.svg?raw`);
        this.icon = icon.default;
    },
});
</script>
