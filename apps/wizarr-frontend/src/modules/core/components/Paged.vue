<template>
    <div>
        <div v-if="hasTitle || hasDescription" class="px-1 pt-1">
            <Transition name="fade" mode="out-in" :duration="{ enter: 200, leave: 200 }">
                <div class="flex flex-col">
                    <h1 class="relative text-lg md:text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white" :key="carouselTitle" v-if="hasTitle">
                        {{ carouselTitle }}
                    </h1>
                    <div class="flex flex-col w-full text-sm text-gray-800 dark:text-gray-200" :key="carouselDescription" v-if="hasDescription">
                        {{ carouselDescription }}
                    </div>
                </div>
            </Transition>
        </div>
        <template v-for="(view, index) in carouselViews">
            <Transition name="fade" mode="out-in" :duration="{ enter: 200, leave: 200 }">
                <div class="flex flex-col items-center justify-center" v-if="currentComponent == index + 1" :key="index + 1">
                    <div class="relative w-full">
                        <div class="text-gray-900 dark:text-white" :class="hasTitle ? 'px-1 pb-1 pt-4' : config.padding">
                            <template v-if="index + 1 == currentComponent && view.asyncComponent">
                                <component v-bind="{ ...view.props, ...attrs }" :is="view.asyncComponent" :class="carouselWait ? 'hidden' : ''" />
                            </template>
                        </div>
                    </div>
                </div>
            </Transition>
        </template>
        <Transition name="fade" mode="out-in" :duration="{ enter: 200, leave: 200 }">
            <div class="z-20 bg-white dark:bg-gray-800 absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center flex-col space-y-1" v-if="carouselWait">
                <i class="fa-solid fa-spinner fa-spin text-4xl text-center text-gray-900 dark:text-white"></i>
                <p class="text-center font-semibold text-gray-900 dark:text-white">
                    {{ __("Please wait...") }}
                </p>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import type { Component } from "vue";

export interface CarouselView {
    component: () => Promise<Component>;
    asyncComponent?: Component;
    props?: Record<string, any>;
    name?: string;
    title?: string;
    description?: string;
}

export interface CarouselConfig {
    padding?: string;
    overflowHidden?: boolean;
    transition?: string;
}

export default defineComponent({
    name: "Carousel",
    data() {
        return {
            currentComponent: this.currentView,
            carouselViews: [] as CarouselView[],
            carouselWait: true,
            carouselTitle: this.pageTitle,
            carouselDescription: this.pageDescription,
        };
    },
    props: {
        views: {
            type: Array as () => CarouselView[],
            required: true,
        },
        currentView: {
            type: Number,
            default: 1,
            required: false,
        },
        pleaseWait: {
            type: Boolean,
            default: false,
            required: false,
        },
        pageTitle: {
            type: String as () => CarouselView["title"],
            default: undefined,
            required: false,
        },
        pageDescription: {
            type: String as () => CarouselView["description"],
            default: undefined,
            required: false,
        },
        config: {
            type: Object as () => CarouselConfig,
            default: () => ({
                padding: "p-2 sm:p-1",
            }),
            required: false,
        },
    },
    methods: {
        asyncComponent(component: CarouselView["component"]) {
            return defineAsyncComponent({
                loader: component,
            });
        },
        mapViews() {
            return this.views.map((view) => {
                return {
                    ...view,
                    asyncComponent: this.asyncComponent(view.component),
                };
            });
        },
    },
    watch: {
        currentComponent: {
            handler(index: number) {
                // Update the page title
                const view = this.carouselViews[index - 1];
                this.carouselTitle = view?.title ? view.title : undefined;
                this.carouselDescription = view?.description ? view.description : undefined;
            },
            immediate: false,
        },
        currentView: {
            handler(index: number) {
                this.currentComponent = index;
            },
            immediate: false,
        },
        pleaseWait: {
            handler(value: boolean) {
                this.carouselWait = value;
            },
            immediate: false,
        },
    },
    computed: {
        hasTitle(): boolean {
            return !!this.carouselTitle;
        },
        hasDescription(): boolean {
            return !!this.carouselDescription;
        },
        attrs(): Record<string, any> {
            return {
                ...this.$attrs,
                onNextStep: () => this.currentComponent++,
                onPrevStep: () => this.currentComponent--,
                onPleaseWait: (value: boolean) => (this.carouselWait = value),
                onUpdateTitle: (title: string) => (this.carouselTitle = title),
                onUpdateDescription: (description: string) => (this.carouselDescription = description),
                onGoTo: (index: number) => (this.currentComponent = index),
            };
        },
    },
    async mounted() {
        // Map views to async components
        this.carouselViews = this.mapViews();

        const view = this.carouselViews[this.currentView - 1];
        this.carouselTitle = view?.title ? view.title : undefined;
        this.carouselDescription = view?.description ? view.description : undefined;

        this.carouselWait = this.pleaseWait ?? false;
    },
});
</script>
