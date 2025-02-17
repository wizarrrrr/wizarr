<template>
    <div class="fixed top-0 bottom-0 left-0 right-0 z-50 inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div class="dark:text-white text-lg w-full flex flex-col items-center justify-center">
            <div class="w-[70px] stroke-primary">
                <div class="loader">
                    <svg class="circular-loader" viewBox="25 25 50 50">
                        <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke-width="4" />
                    </svg>
                </div>
            </div>
            <div class="relative w-full flex justify-center">
                <TransitionGroup name="fade">
                    <template v-for="(message, index) in messages" :key="index">
                        <span class="absolute text-center mt-4 font-semibold text-gray-900 dark:text-white ml-1" v-if="index === showingMessage">{{ message }}...</span>
                    </template>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loader {
    position: relative;
}
.loader:before {
    content: "";
    display: block;
    padding-top: 100%;
}

.circular-loader {
    -webkit-animation: rotate 2s linear infinite;
    animation: rotate 2s linear infinite;
    height: 100%;
    -webkit-transform-origin: center center;
    -ms-transform-origin: center center;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    margin: auto;
}

.loader-path {
    stroke-dasharray: 150, 200;
    stroke-dashoffset: -10;
    -webkit-animation: dash 1.5s ease-in-out infinite;
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
}

@-webkit-keyframes rotate {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes rotate {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
@-webkit-keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
    }
}
@keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
    }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { updateTheme } from "@/ts/utils/darkMode";

export default defineComponent({
    name: "FullPageLoading",
    data() {
        return {
            messages: ["Please wait", "Preparing the spells", "Mixing the potions", "Summoning the spirits", "Waving our wands"],
            showingMessage: 0,
        };
    },
    mounted() {
        const themeStore = JSON.parse(localStorage.getItem("theme") || "{}");
        updateTheme(themeStore.theme || "dark");
        setInterval(() => {
            this.showingMessage++;
            if (this.showingMessage >= this.messages.length) {
                this.showingMessage = 0;
            }
        }, 4000);
    },
});
</script>
