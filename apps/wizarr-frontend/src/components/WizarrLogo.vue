<template>
    <Logo :class="{ [svgSize]: true }" :viewBox="svgZoom" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Logo from "@/assets/img/wizarr-logo.svg?component";

export default defineComponent({
    name: "WizarrLogo",
    components: {
        Logo,
    },
    props: {
        size: {
            type: String as () => "xxs" | "xs" | "md" | "lg" | "xl" | "2xl" | "3xl",
            default: "md",
        },
        zoom: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        svgZoom() {
            const minX = 30;
            const minY = 44;
            const width = 550;
            const height = 550;

            return `${minX} ${minY} ${width} ${height}`;
        },
        svgSize() {
            switch (this.size) {
                case "xxs":
                    return "w-4 h-4";
                case "xs":
                    return "w-6 h-6";
                case "md":
                    return "w-8 h-8";
                case "lg":
                    return "w-12 h-12";
                case "xl":
                    return "w-16 h-16";
                case "2xl":
                    return "w-20 h-20";
                case "3xl":
                    return "w-24 h-24";
                default:
                    return "w-8 h-8";
            }
        },
    },
});
</script>
