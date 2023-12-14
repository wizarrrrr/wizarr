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
    name: "ServerForm",
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
                name: "",
                description: "",
                type: "",
                host: "",
                hostOverride: "",
                apiKey: "",
            },
            views: [
                {
                    name: "select",
                    component: () => import("./pages/ServerSelect.vue"),
                    props: {
                        eventBus: this.eventBus,
                    },
                },
                {
                    name: "information",
                    component: () => import("./pages/ServerInformation.vue"),
                    props: {
                        eventBus: this.eventBus,
                    },
                },
                {
                    name: "connection",
                    component: () => import("./pages/ServerConnection.vue"),
                    props: {
                        eventBus: this.eventBus,
                    },
                },
                {
                    name: "complete",
                    component: () => import("./pages/ServerComplete.vue"),
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
