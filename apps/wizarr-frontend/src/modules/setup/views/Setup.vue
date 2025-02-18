<template>
    <div class="flex flex-column space-x-1 absolute top-0 right-0 mt-2 mr-2">
        <ThemeToggle />
        <LanguageSelector />
    </div>
    <div>
        <div class="flex justify-center items-center flex-col mt-12 mb-3 space-y-6">
            <WizarrLogo class="w-[150px] h-[150px] rounded-[10px]" />
        </div>
        <section>
            <div class="flex flex-col items-center justify-center md:container py-8 mx-auto">
                <div class="w-full md:w-1/2 lg:w-1/3 bg-white rounded shadow dark:border dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <div class="relative">
                        <Carousel :views="views" :currentView="currentView" :pleaseWait="pleaseWait" :config="{ padding: false }" />
                    </div>
                </div>
            </div>
        </section>
        <Transition name="fade" mode="out-in">
            <div class="flex justify-center items-center flex-row space-x-3" v-if="!disabledNavigation">
                <FormKit type="button" :label="__('Back')" @click="currentView--" prefix-icon="fa-solid fa-arrow-left" :disabled="currentView === 1" />
                <FormKit type="button" :label="__('Next')" @click="currentView++" suffix-icon="fa-solid fa-arrow-right" :disabled="currentView === views.length" />
            </div>
        </Transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Carousel, { type CarouselView } from "@/modules/core/components/Carousel.vue";
import WizarrLogo from "@/components/WizarrLogo.vue";

import LanguageSelector from "@/components/Buttons/LanguageSelector.vue";
import ThemeToggle from "@/components/Buttons/ThemeToggle.vue";

export default defineComponent({
    name: "Setup",
    components: {
        WizarrLogo,
        Carousel,
        LanguageSelector,
        ThemeToggle,
    },
    data() {
        return {
            pleaseWait: false,
            currentView: 1,
            views: [
                {
                    name: "welcome",
                    component: () => import("../pages/Welcome.vue"),
                },
                {
                    name: "eula",
                    title: this.__("End User License Agreement"),
                    component: () => import("../pages/EULA.vue")
                },
                {
                    name: "database",
                    title: this.__("Database"),
                    component: () => import("../pages/Database.vue"),
                },
                {
                    name: "restore",
                    title: this.__("Restore"),
                    component: () => import("../pages/Restore.vue"),
                },
                {
                    name: "account",
                    title: this.__("Account"),
                    component: () => import("../pages/Account.vue"),
                },
                {
                    name: "complete",
                    component: () => import("../pages/Complete.vue"),
                },
            ] as CarouselView[],
        };
    },
    methods: {
        findIndex(names: string[]): number[] {
            const indexArray = [];

            for (const name of names) {
                indexArray.push(this.views.findIndex((view) => view.name === name) + 1);
            }

            return indexArray;
        },
    },
    computed: {
        disabledNavigation() {
            return this.findIndex(["account", "complete"]).includes(this.currentView);
        },
    },
    async mounted() {
        this.$toast.info("Welcome to Wizarr!");
    },
});
</script>
