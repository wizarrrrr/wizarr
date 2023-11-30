<template></template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "MediaServerAuthentication",
    props: {
        eventBus: {
            type: Object,
            required: true,
        },
    },
    mounted() {
        console.log(this.eventBus);
    },
});
</script>
