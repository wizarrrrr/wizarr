<template>
    <Carousel :views="views" :currentView="currentView" :pleaseWait="pleaseWait" :stepper="activeStep" :config="{ padding: 'px-[1px]' }" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Carousel from "@/modules/core/components/Carousel.vue";
import mitt from "mitt";

const eventBus = mitt<EventRecords>();

export type EventRecords = {
    updateServer: Record<any, any>;
    pleaseWait: boolean;
};

export default defineComponent({
    name: "MediaServerForm",
    components: {
        Carousel,
    },
    data() {
        return {
            eventBus: eventBus,
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
                        eventBus: eventBus,
                    },
                },
                {
                    name: "settings",
                    component: () => import("./pages/MediaServerAuthentication.vue"),
                    props: {
                        eventBus: eventBus,
                    },
                },
            ],
        };
    },
    async beforeCreate() {
        eventBus.on("updateServer", (data) => {
            console.log(data);
            this.server = { ...this.server, ...data };
        });
        eventBus.on("*", (type, data) => {
            console.log(type, data);
        });
    },
});
</script>
