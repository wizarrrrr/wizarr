<template>
    <div class="mx-[-1.5rem] mt-[-1.5rem]">
        <Tabbed :tabs="tabs" class="px-7 pt-7 pb-2" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { Server as IServer } from "@wizarrrr/wizarr-sdk";

import Tabbed from "@/modules/core/components/Tabbed.vue";

export default defineComponent({
    name: "ServerEditForm",
    components: {
        Tabbed,
    },
    props: {
        server: {
            type: Object as () => IServer,
            required: true,
        },
    },
    data() {
        return {
            tabs: [
                {
                    name: "Information",
                    icon: "fa-server",
                    props: {
                        server: this.server,
                    },
                    component: () => import("./pages/ServerInformation.vue"),
                },
                {
                    name: "Connection",
                    icon: "fa-plug",
                    props: {
                        server: this.server,
                    },
                    component: () => import("./pages/ServerConnection.vue"),
                },
                {
                    name: "Permissions",
                    icon: "fa-lock",
                    props: {
                        server: this.server,
                    },
                    component: () => import("./pages/ServerPermissions.vue"),
                },
            ],
        };
    },
});
</script>
