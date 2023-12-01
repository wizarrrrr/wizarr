<template>
    <div>
        <!-- Host -->
        <FormKit type="url" v-model="host" :label="__('Media Server')" :value="host" :placeholder="hostPlaceholder" />
        <!--  -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { EventRecords } from "../MediaServerForm.vue";
import type { Emitter } from "mitt";

export default defineComponent({
    name: "MediaServerAuthentication",
    props: {
        eventBus: {
            type: Object as () => Emitter<EventRecords>,
            required: true,
        },
    },
    data() {
        return {
            type: "",
            host: "",
        };
    },
    computed: {
        hostPlaceholder(): string {
            return `http://${this.type}.example.com`;
        },
    },
    beforeMount() {
        this.eventBus.emit("getServer", (payload) => {
            console.log(payload);
            this.type = payload.type;
        });
    },
});
</script>
