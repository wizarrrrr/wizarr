<template>
    <button type="button" @click="createModal()" class="relative rounded-full text-gray-400 hover:text-white">
        <span class="sr-only">View translations</span>
        <LanguageIcon class="size-5" aria-hidden="true" />
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LanguageIcon } from "@heroicons/vue/24/outline";
import LanguageForm from "@/components/Forms/LanguageForm/LanguageForm.vue";

export default defineComponent({
    name: "LanguageSelector",
    components: {
        LanguageIcon,
        LanguageForm,
    },
    methods: {
        createModal() {
            this.$modal.openModal(LanguageForm, {
                title: this.__("Select Language"),
                disableFooter: true,
                size: "sm",
            });
        },
    },
});
</script>
