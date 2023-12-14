<template>
    <nav class="bg-white dark:bg-gray-900 absolute w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <router-link to="/" class="flex items-center">
                <WizarrLogo class="mr-3" rounded />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Wizarr</span>
            </router-link>
            <div class="flex md:order-2" v-if="!hideButton">
                <DefaultButton :to="buttonLink" size="sm">
                    {{ button }}
                </DefaultButton>
            </div>
            <div class="flex md:order-3" v-if="showToggles">
                <div class="flex flex-column space-x-1">
                    <ThemeToggle />
                    <LanguageSelector />
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

import WizarrLogo from "@/components/WizarrLogo.vue";
import DefaultButton from "@/components/Buttons/DefaultButton.vue";

import LanguageSelector from "@/components/Buttons/LanguageSelector.vue";
import ThemeToggle from "@/components/Buttons/ThemeToggle.vue";

export default defineComponent({
    name: "DefaultNavBar",
    components: {
        WizarrLogo,
        RouterLink,
        DefaultButton,
        LanguageSelector,
        ThemeToggle,
    },
    props: {
        title: {
            type: String,
            default: "Wizarr",
        },
        button: {
            type: String,
            default: "Homepage",
        },
        buttonLink: {
            type: String,
            default: "/",
        },
        hideButton: {
            type: Boolean,
            default: false,
        },
        showToggles: {
            type: Boolean,
            default: false,
        },
    },
});
</script>
