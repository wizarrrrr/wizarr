<template>
    <div class="absolute top-0 left-0 w-full h-full">
        <div class="flex flex-column justify-end space-x-1 m-2">
            <ThemeToggle />
            <LanguageSelector />
        </div>
        <div class="flex justify-center items-center flex-col mt-12 mb-3 space-y-6">
            <WizarrLogo class="w-[150px] h-[150px] rounded-[10px]" />
        </div>
        <div class="flex flex-col items-center justify-center md:container py-8 m-auto">
            <div class="w-full md:w-1/2 lg:w-1/3 bg-white rounded shadow dark:border dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                <div class="relative">
                    <Carousel :views="views" :currentView="currentView" :pageTitle="pageTitle" :pleaseWait="pleaseWait" :stepper="activeStep" />
                </div>
            </div>
        </div>
        <div class="flex justify-center items-center flex-col mb-3 space-y-6">
            <p class="text-sm text-center text-gray-900 dark:text-white">
                {{ __("Made by ") }}
                <a class="text-primary font-bold hover:underline" target="_blank" href="https://github.com/wizarrrrr/wizarr">Wizarr</a>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Collapse } from "vue-collapsed";

import Carousel from "../../core/components/Carousel.vue";
import WizarrLogo from "@/components/WizarrLogo.vue";

import LanguageSelector from "@/components/Buttons/LanguageSelector.vue";
import ThemeToggle from "@/components/Buttons/ThemeToggle.vue";

import eventBus from "../events";

import type { Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@/plugins/socket";
import type { EventRecords } from "../types/EventRecords";
import type { Emitter } from "mitt";

export default defineComponent({
    name: "JoinView",
    components: {
        WizarrLogo,
        Carousel,
        Collapse,
        LanguageSelector,
        ThemeToggle,
    },
    data() {
        return {
            socket: null as Socket<ServerToClientEvents, ClientToServerEvents> | null,
            invitation: null as Record<string, any> | null,
            eventBus: eventBus as Emitter<EventRecords>,
            pleaseWait: false,
            pageTitle: "",
            currentView: 1,
            activeStep: 0,
            views: [
                {
                    name: "join",
                    title: this.__("Please enter your invite code"),
                    component: () => import("../pages/JoinForm.vue"),
                    props: {
                        eventBus: eventBus,
                    },
                },
                {
                    name: "create",
                    title: this.__("Setup your account"),
                    component: () => import("../pages/Signup.vue"),
                    props: {
                        eventBus: eventBus,
                    },
                },
                {
                    name: "stepper",
                    title: this.__("Please wait..."),
                    component: () => import("../pages/Stepper.vue"),
                    props: {
                        eventBus: eventBus,
                    },
                },
                {
                    name: "success",
                    title: this.__("All done!"),
                    component: () => import("../pages/Complete.vue"),
                    props: {
                        eventBus: eventBus,
                    },
                },
                {
                    name: "error",
                    component: () => import("../pages/Error.vue"),
                    props: {
                        title: this.__("Uh oh!"),
                        message: this.__("Something went wrong while trying to join the server. Please try again later."),
                    },
                },
            ],
        };
    },
    computed: {
        noHeader() {
            return this.isView(["error"]);
        },
    },
    methods: {
        isView(name: string | string[]) {
            return Array.isArray(name) ? name.includes(this.views[this.currentView - 1].name) : this.views[this.currentView - 1].name == name;
        },
        async showError(title: string, message: string) {
            // Hide the please wait screen
            this.pleaseWait = false;

            // Change the error screen props
            this.views[this.currentView - 1].props = {
                title: title,
                message: message,
            };

            // Show the error screen
            this.currentView = this.views.findIndex((view) => view.name == "error") + 1;
        },
        async connected() {
            // Check for a socket id
            if (this.socket?.id == undefined) {
                this.showError(this.__("Uh oh!"), this.__("Could not connect to the server."));
            }

            setTimeout(() => this.socket?.emit("stdout"), 1000);

            this.pleaseWait = false;
        },
    },
    async mounted() {
        // Initialize the socket connection
        // this.socket = this.$io("/jellyfin" /*+ this.settings.server_type*/);
        // this.socket.on("connect", () => this.connected());

        // // this.socket.on("connect_error", () => this.showError(this.__("Uh oh!"), this.__("Could not connect to the server.")));
        // // this.socket.on("error", (message) => this.showError(this.__("Uh oh!"), message));
        // this.socket.on("error", this.$toast.error);
        // this.socket.on("log", (message) => console.error(message));
        // this.socket.on("message", this.$toast.info);
        // this.socket.on("step", (step: number) => (this.activeStep = step));
        // this.socket.on("done", () => setTimeout(() => (this.currentView = this.views.findIndex((view) => view.name == "success") + 1), 1000));

        this.eventBus.on("pleaseWait", (pleaseWait) => (this.pleaseWait = pleaseWait));
        this.eventBus.on("pageTitle", (title) => (this.pageTitle = title));
    },
    async beforeUnmount() {
        // Disconnect the socket
        this.socket?.disconnect();

        // Remove the event bus listeners
        this.eventBus.off("*");
    },
});
</script>
