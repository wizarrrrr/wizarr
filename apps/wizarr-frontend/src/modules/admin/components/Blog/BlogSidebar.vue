<template>
    <div class="w-64 p-4 bg-white rounded shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 text-gray-900 dark:text-white">
        <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.name">
                <router-link :to="item.link" class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    <i class="fa mr-1" :class="item.icon" />
                    <span>{{ item.name }}</span>
                </router-link>
            </li>
        </ul>
        <ul class="space-y-2 mt-4">
            <li class="font-semibold text-sm text-gray-600 dark:text-gray-400 pl-1">Other</li>
            <li v-for="item in otherItems" :key="item.name">
                <router-link :to="item.link" class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    <i class="fa mr-1" :class="item.icon" />
                    <span>{{ item.name }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";

interface MenuItem {
    name: string;
    link: string;
    icon: string;
}

const menuItems = ref<MenuItem[]>([
    { name: "Home", link: "#", icon: "fa-home" },
    { name: "Reading list", link: "#reading-list", icon: "fa-book" },
    { name: "Listings", link: "#listings", icon: "fa-file-alt" },
    { name: "Podcasts", link: "#podcasts", icon: "fa-podcast" },
    { name: "Videos", link: "#videos", icon: "fa-video" },
    { name: "Tags", link: "#tags", icon: "fa-tags" },
    { name: "FAQ", link: "#faq", icon: "fa-question-circle" },
    { name: "Sponsors", link: "#sponsors", icon: "fa-heart" },
    { name: "About", link: "#about", icon: "fa-info-circle" },
]);

const otherItems = ref<MenuItem[]>([
    { name: "Privacy policy", link: "#privacy", icon: "fa-lock" },
    { name: "Terms of use", link: "#terms", icon: "fa-globe" },
    { name: "Contact", link: "#contact", icon: "fa-address-book" },
]);
</script>
