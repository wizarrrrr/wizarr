<template>
    <!-- Main container -->
    <div class="flex flex-col items-center justify-center">
        <!-- Header section -->
        <div class="w-full bg-white dark:bg-gray-900">
            <!-- Header content (conditionally rendered if header, subheader, or header slot is available) -->
            <div v-if="header || subheader || headerSlotAvailable" class="flex items-center justify-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600">
                <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-row justify-between py-4 flex flex-row justify-between w-full">
                    <!-- Header text and subheader -->
                    <div class="flex items-center">
                        <div class="flex flex-col justify-start">
                            <!-- Main header with transition support -->
                            <div class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                <Transition v-if="transition" name="fade-fast" mode="out-in" :duration="{ enter: 300, leave: 300 }">
                                    <span :key="header">{{ header ?? "" }}</span>
                                </Transition>
                                <span v-else>{{ header ?? "" }}</span>
                            </div>
                            <!-- Subheader with transition support -->
                            <div class="text-sm font-semibold leading-tight tracking-tight text-gray-900 md:text-md dark:text-gray-400">
                                <Transition v-if="transition" name="fade-fast" mode="out-in" :duration="{ enter: 300, leave: 300 }">
                                    <span :key="subheader">{{ subheader ?? "" }}</span>
                                </Transition>
                                <span v-else>{{ subheader ?? "" }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Slot for additional header content -->
                    <div class="flex items-center justify-end space-x-2">
                        <slot name="header" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Content section -->
        <div :class="align ? 'w-full mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-6' : 'w-full'">
            <slot />
        </div>

        <!-- Footer section (conditionally rendered if footer or footer actions slot is available) -->
        <div v-if="footerSlotAvailable || footerActionsSlotAvailable" class="flex items-center justify-between mb-6 md:mb-0 px-6 md:px-0">
            <!-- Slot for footer content -->
            <div class="flex items-center">
                <slot name="footer" />
            </div>
            <!-- Slot for footer actions -->
            <div class="flex items-center justify-end space-x-2">
                <slot name="footerActions" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from "vue";

// Define props
const props = defineProps({
    header: {
        type: String,
    },
    subheader: {
        type: String,
    },
    class: {
        type: String,
        default: "",
    },
    transition: {
        type: Boolean,
        default: false,
    },
    align: {
        type: Boolean,
        default: true,
    },
});

// Access slots
const slots = useSlots();

// Computed properties to check if slots are available
const headerSlotAvailable = computed(() => !!slots.header);
const footerSlotAvailable = computed(() => !!slots.footer);
const footerActionsSlotAvailable = computed(() => !!slots.footerActions);
</script>
