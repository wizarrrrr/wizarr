<template>
    <BaseAlert type="warning" :text="text">
        <slot />
    </BaseAlert>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseAlert from "./BaseAlert.vue";

export default defineComponent({
    name: "WarningAlert",
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
