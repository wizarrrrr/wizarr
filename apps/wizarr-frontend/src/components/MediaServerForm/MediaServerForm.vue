<template>
    <Carousel :views="views" :currentView="currentView" :pleaseWait="pleaseWait" :stepper="activeStep" :config="{ padding: 'px-[1px]' }" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Carousel from "@/modules/core/components/Carousel.vue";
import type { Emitter } from "mitt";

export type EventRecords = {
    updateServer: Record<any, any>;
    getServer: (payload: Record<string, string>) => void;
};

export default defineComponent({
    name: "MediaServerForm",
    components: {
        Carousel,
    },
    props: {
        eventBus: {
            type: Object as () => Emitter<EventRecords>,
            required: true,
        },
    },
    data() {
        return {
            currentView: 1,
            activeStep: 0,
            pleaseWait: false,
            server: {
                type: "",
                host: "",
                port: "",
                username: "",
                password: "",
            },
            views: [
                {
                    name: "join",
                    component: () => import("./pages/MediaServerSelect.vue"),
                    props: {
                        eventBus: this.eventBus,
                    },
                },
                {
                    name: "settings",
                    component: () => import("./pages/MediaServerAuthentication.vue"),
                    props: {
                        eventBus: this.eventBus,
                    },
                },
            ],
        };
    },
    async beforeMount() {
        this.eventBus.on("updateServer", (payload) => {
            this.server = { ...this.server, ...payload };
        });

        this.eventBus.on("getServer", (callback: (payload: typeof this.server) => void) => {
            callback(this.server);
        });
    },
});
</script>
