<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { getCurrentInstance } from "vue";

// Importing components used in the navigation bar
import WizarrLogo from "@/components/WizarrLogo.vue";
import LanguageSelector from "@/components/Buttons/LanguageSelector.vue";
import ThemeToggle from "@/components/Buttons/ThemeToggle.vue";
import HelpButton from "@/components/Buttons/HelpButton.vue";

// Temporary fix for missing translations function
const instance = getCurrentInstance();
const __ = instance?.proxy?.__ ?? ((key: string) => key);

// Store for authentication related states and actions
const authStore = useAuthStore();

// Route definitions
const route = useRoute();
const router = useRouter();

// Enum to define components that can be conditionally hidden or shown
enum COMPONENT {
    USER,
    LANGUAGE,
    THEME,
    HELP,
    BUTTON,
    LOGO,
    MOBILE_NAVIGATION,
    NAVIGATION,
    NOTIFICATIONS,
}

// Enum representing authentication states for showing/hiding pages
enum AUTH {
    LOGGED_IN,
    LOGGED_OUT,
    LOGGED_ANY,
}

// Type to define the string values of the COMPONENT enum
type COMPONENT_STRINGS = keyof typeof COMPONENT;

// Interface defining structure for page items in the navigation
interface Page {
    name: string;
    url: string;
    shown: AUTH; // The authentication state required to show the page
}

// Define props that the component can accept
const navProps = defineProps({
    button: {
        type: Object as () => {
            label: string;
            // Data theme for the button, restricted to specific values
            "data-theme": "primary" | "secondary" | "success" | "danger" | "warning" | "transparent" | "none";
            // Handler function for the button click event
            onClick: () => void;
        },
        required: false,
    },
    // Prop to specify components to hide, should be an array of the COMPONENT enum by string values
    hideComponents: {
        type: Array as () => COMPONENT_STRINGS[],
        required: false,
        default: () => [],
    },
});

// Function to check if a component should be hidden
const isComponentHidden = (component: COMPONENT): boolean => {
    // Convert the enum value to string and check if it's in the hideComponents array
    const componentKey = COMPONENT[component] as COMPONENT_STRINGS;
    return navProps.hideComponents.includes(componentKey);
};

// Array of pages with their display conditions
const pages: readonly Page[] = [
    { name: "Home", url: authStore.isLoggedIn ? "/admin" : "/", shown: AUTH.LOGGED_ANY },
    { name: "Invitations", url: "/admin/invitations", shown: AUTH.LOGGED_IN },
    { name: "Servers", url: "/admin/servers", shown: AUTH.LOGGED_IN },
    { name: "Users", url: "/admin/users", shown: AUTH.LOGGED_IN },
    { name: "Blog", url: authStore.isLoggedIn ? "/admin/blog" : "/blog", shown: AUTH.LOGGED_ANY },
    { name: "Settings", url: "/admin/settings", shown: AUTH.LOGGED_IN },
];

// Menu items for the user options menu
const menuItems = [
    { text: "Your Profile", icon: "fa-user", action: () => router.push("/admin/settings/account") },
    { text: "Settings", icon: "fa-gear", action: () => router.push("/admin/settings") },
    { text: "Logout", icon: "fa-right-from-bracket", action: authStore.logout },
];
</script>

<template>
    <Disclosure as="nav" class="z-20 bg-white dark:bg-gray-900 absolute w-full top-0 left-0 right-0 border-b border-gray-200 dark:border-gray-600 md:h-[64px]" v-slot="{ open }">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="flex items-center">
                    <!-- Logo link, displayed unless 'LOGO' is in hideComponents -->
                    <router-link to="/" class="flex items-center" v-if="!isComponentHidden(COMPONENT.LOGO)">
                        <WizarrLogo class="rounded-md" />
                    </router-link>
                    <div class="hidden sm:ml-6 sm:block" v-if="!isComponentHidden(COMPONENT.NAVIGATION)">
                        <div class="flex space-x-4">
                            <!-- Navigation links for each page -->
                            <template v-for="page in pages" :key="page.name">
                                <router-link v-if="(page.shown === AUTH.LOGGED_IN && authStore.isLoggedIn === true) || (page.shown === AUTH.LOGGED_OUT && authStore.isLoggedIn === false) || page.shown === AUTH.LOGGED_ANY" :to="page.url" class="rounded-md px-3 py-2 text-sm font-semibold" :class="route.path == page.url || (page.url == '/admin/settings' && route.path.includes('/admin/settings')) ? 'bg-gray-800 text-white' : 'text-black dark:text-gray-300 hover:bg-gray-700 hover:text-white'">
                                    {{ __(page.name) }}
                                </router-link>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- Right-side components, conditionally hidden based on hideComponents -->
                <div class="hidden sm:ml-6 sm:block">
                    <div class="flex items-center space-x-3">
                        <!-- Language selector, hidden if 'LANGUAGE' is specified in hideComponents -->
                        <LanguageSelector v-if="!isComponentHidden(COMPONENT.LANGUAGE)" />
                        <!-- Theme toggle button -->
                        <ThemeToggle v-if="!isComponentHidden(COMPONENT.THEME)" />
                        <!-- Help button -->
                        <HelpButton v-if="!isComponentHidden(COMPONENT.HELP)" />
                        <!-- Custom form button, only shown if defined and not hidden -->
                        <FormKit v-if="navProps.button?.label && !isComponentHidden(COMPONENT.BUTTON)" type="button" :label="navProps.button.label" :data-theme="navProps.button['data-theme']" :onClick="navProps.button.onClick" />
                        <!-- Notification bell and menu, hidden if 'USER' in hideComponents -->
                        <Menu v-if="authStore.isLoggedIn && !isComponentHidden(COMPONENT.NOTIFICATIONS)" as="div" class="size-5 relative">
                            <MenuButton class="relative rounded-full text-gray-400 hover:text-black dark:hover:text-white">
                                <span class="sr-only">View notifications</span>
                                <BellIcon class="size-5" aria-hidden="true" />
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                <MenuItems class="absolute right-0 z-21 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 ring-1 shadow-lg ring-black/5 overflow-hidden">
                                    <MenuItem>
                                        <div class="block px-4 py-2 text-sm text-gray-700 dark:text-white flex flex-col">
                                            <span>Lorem Ipsum</span>
                                        </div>
                                    </MenuItem>
                                    <MenuItem>
                                        <div class="block px-4 py-2 text-sm text-gray-700 dark:text-white flex flex-col">
                                            <span>Lorem Ipsum</span>
                                        </div>
                                    </MenuItem>
                                    <MenuItem>
                                        <div class="block px-4 py-2 text-sm text-gray-700 dark:text-white flex flex-col">
                                            <span>Lorem Ipsum</span>
                                        </div>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                        <Menu v-if="authStore.isLoggedIn && !navProps.button?.label && !isComponentHidden(COMPONENT.USER)" as="div" class="relative">
                            <MenuButton class="relative flex rounded-full bg-gray-800 text-sm hover:opacity-80">
                                <span class="sr-only">Open user menu</span>
                                <img class="size-8 rounded-md" src="../assets/img/profile.jpg" alt="User avatar" />
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                <MenuItems class="absolute right-0 z-21 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 ring-1 shadow-lg ring-black/5 overflow-hidden">
                                    <!-- Menu item showing the user's name and email -->
                                    <MenuItem v-if="authStore.user">
                                        <div class="block px-4 py-2 text-sm text-gray-700 dark:text-white flex flex-col">
                                            <span>{{ authStore.user.name }}</span>
                                            <span>{{ authStore.user.email }}</span>
                                        </div>
                                    </MenuItem>
                                    <MenuItem v-for="item in menuItems" :key="item.text" v-slot="{ active }">
                                        <a href="#" @click="item.action" :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white flex justify-between items-center']">
                                            <span>{{ item.text }}</span>
                                            <i :class="['fa-solid fa-lg', item.icon]"></i>
                                        </a>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
                <!-- Mobile menu button, shown when sm:hidden -->
                <!-- Custom form button, only shown if defined and not hidden -->
                <FormKit v-if="navProps.button?.label && isComponentHidden(COMPONENT.MOBILE_NAVIGATION)" type="button" :label="navProps.button.label" :data-theme="navProps.button['data-theme']" :onClick="navProps.button.onClick" />
                <div v-if="!isComponentHidden(COMPONENT.MOBILE_NAVIGATION)" class="-mr-2 flex sm:hidden">
                    <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-inset">
                        <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
                        <XMarkIcon v-else class="block size-6" aria-hidden="true" />
                    </DisclosureButton>
                </div>
            </div>
        </div>
        <!-- Mobile-only panel for user profile and navigation -->
        <DisclosurePanel class="sm:hidden h-[100%]">
            <div v-if="authStore.isLoggedIn && authStore.user" class="border-y border-gray-700 pt-4 pb-3">
                <div class="flex items-center px-5">
                    <div class="shrink-0">
                        <img class="size-10 rounded-md" src="../assets/img/profile.jpg" alt="" />
                    </div>
                    <div class="ml-3">
                        <div class="text-base font-medium text-white">{{ authStore.user.name }}</div>
                        <div class="text-sm font-medium text-gray-400">{{ authStore.user.email }}</div>
                    </div>
                </div>
            </div>
            <!-- Mobile navigation links -->
            <div class="space-y-1 px-2 pt-2 pb-3">
                <template v-for="page in pages" :key="page.name">
                    <router-link v-if="(page.shown === AUTH.LOGGED_IN && authStore.isLoggedIn === true) || (page.shown === AUTH.LOGGED_OUT && authStore.isLoggedIn === false) || page.shown === AUTH.LOGGED_ANY" :to="page.url" class="block rounded-md px-3 py-2 text-base font-medium" :class="route.path == page.url ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'">
                        {{ __(page.name) }}
                    </router-link>
                </template>
            </div>
        </DisclosurePanel>
    </Disclosure>
</template>

<style>
/* Custom style to ensure the navbar is full height when open */
nav[data-headlessui-state="open"] {
    height: 100%;
}
</style>
