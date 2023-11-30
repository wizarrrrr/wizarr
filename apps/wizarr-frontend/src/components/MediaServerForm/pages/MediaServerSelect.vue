<template>
    <div class="flex flex-col">
        <FormKit type="select" :label="__('Select Media Server')" :options="options" v-model="selected" :classes="{ outer: '!mb-2' }" />
        <FormKit type="button" :label="__('Next')" @click="nextStep" :classes="{ input: '!py-2', wrapper: 'flex justify-end' }" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { EventRecords } from "../MediaServerForm.vue";
import type { Emitter } from "mitt";

export default defineComponent({
    name: "MediaServerSelect",
    props: {
        eventBus: {
            type: Object as () => Emitter<EventRecords>,
            required: true,
        },
    },
    data() {
        return {
            options: [
                { label: "Plex", value: "plex" },
                { label: "Jellyfin", value: "jellyfin" },
            ],
            selected: undefined,
        };
    },
    methods: {
        nextStep() {
            this.eventBus.emit("updateServer", { type: this.selected });
            // this.$emit("nextStep");
        },
    },
});
</script>
