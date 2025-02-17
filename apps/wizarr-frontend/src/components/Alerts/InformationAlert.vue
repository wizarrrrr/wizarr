<template>
    <BaseAlert type="information" :text="text">
        <slot />
    </BaseAlert>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseAlert from "./BaseAlert.vue";

export default defineComponent({
    name: "InformationAlert",
    components: {
        BaseAlert,
    },
    props: {
        text: {
            type: String,
            required: false,
        },
    },
});
</script>
