<template>
    <div class="pt-2 px-6 pb-6 sm:px-8 sm:pb-8">
        <MediaForm v-bind="$attrs" :setup="true" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MediaForm from "@/modules/settings/components/Forms/MediaForm.vue";

export default defineComponent({
    name: "MediaServerView",
    components: {
        MediaForm,
    },
});
</script>
