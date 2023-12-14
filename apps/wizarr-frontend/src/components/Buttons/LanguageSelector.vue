<template>
    <button class="text-gray-500 dark:text-gray-400 focus:outline-none text-sm" type="button" @click="createModal">
        <div :class="iconClasses" class="flex items-center justify-center rounded hover:bg-gray-200 hover:dark:bg-gray-700">
            <i class="fa-solid fa-md fa-globe"></i>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LanguageForm from "@/components/Forms/LanguageForm/LanguageForm.vue";

export default defineComponent({
    name: "LanguageSelector",
    components: {
        LanguageForm,
    },
    props: {
        iconClasses: {
            type: String,
            default: "w-6 h-6",
        },
    },
    computed: {
        iconClasses(): string {
            return this.iconClasses;
        },
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
