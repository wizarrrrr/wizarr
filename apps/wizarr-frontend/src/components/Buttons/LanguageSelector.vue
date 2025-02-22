<template>
    <!-- Button to trigger the language selection modal -->
    <button type="button" @click="createModal" class="relative rounded-full text-gray-400 hover:text-black dark:hover:text-white">
        <span class="sr-only">View translations</span>
        <LanguageIcon class="size-5" aria-hidden="true" />
    </button>
</template>

<script lang="ts" setup>
import { LanguageIcon } from "@heroicons/vue/24/outline";
import { useModal } from "@/plugins/modal";
import { getCurrentInstance } from "vue";

import LanguageForm from "@/components/Forms/LanguageForm/LanguageForm.vue";

// Temporary fix for missing translations function
const instance = getCurrentInstance();
const __ = instance?.proxy?.__ ?? ((key: string) => key);

// Use the modal service to control modals in the application
const modalService = useModal();

// Function to open the language selection modal
const createModal = () => {
    // Check if the modal service is available
    if (modalService) {
        // Open the modal with the LanguageForm component as its content
        modalService.openModal(LanguageForm, {
            title: __("Select Language"), // Modal title, assuming __() is a translation function
            disableFooter: true, // Disable the footer in the modal
            size: "sm", // Set the modal size to 'small'
        });
    } else {
        // Warn if the modal service is not available
        console.warn("Modal service is not available");
    }
};
</script>
