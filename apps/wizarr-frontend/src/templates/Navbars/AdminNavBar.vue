<template>
    <Disclosure as="nav" class="z-20 bg-white dark:bg-gray-900 absolute w-full top-0 left-0 right-0 border-b border-gray-200 dark:border-gray-600 md:h-[64px]" v-slot="{ open }">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="flex items-center">
                    <router-link to="/" class="flex items-center">
                        <WizarrLogo class="rounded-md" />
                    </router-link>
                    <div class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">
                            <router-link v-for="page in pages" :key="page.name" :to="page.url" class="rounded-md px-3 py-2 text-sm font-semibold" :class="$route.path == page.url || (page.url == '/admin/settings' && $route.path.includes('/admin/settings')) ? 'bg-gray-800 text-white' : 'text-black dark:text-gray-300 hover:bg-gray-700 hover:text-white'">
                                {{ __(page.name) }}
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="hidden sm:ml-6 sm:block">
                    <div class="flex items-center space-x-3">
                        <LanguageSelector />
                        <ThemeToggle />
                        <HelpButton />
                        <button type="button" class="relative rounded-full text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span class="sr-only">View notifications</span>
                            <BellIcon class="size-5" aria-hidden="true" />
                        </button>
                        <Menu as="div" class="relative">
                            <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span class="sr-only">Open user menu</span>
                                <img class="size-8 rounded-full" src="../../assets/img/profile.jpg" alt="User avatar" />
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                <MenuItems class="absolute right-0 z-21 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 ring-1 shadow-lg ring-black/5 overflow-hidden">
                                    <MenuItem v-for="item in menuItems" :key="item.text" v-slot="{ active }">
                                        <a href="#" :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-white flex justify-between items-center']">
                                            <span>{{ item.text }}</span>
                                            <i :class="['fa-solid fa-lg', item.icon]"></i>
                                        </a>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
                <div class="-mr-2 flex sm:hidden">
                    <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-inset">
                        <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
                        <XMarkIcon v-else class="block size-6" aria-hidden="true" />
                    </DisclosureButton>
                </div>
            </div>
        </div>
        <DisclosurePanel class="sm:hidden h-[100%]">
            <div class="border-y border-gray-700 pt-4 pb-3">
                <div class="flex items-center px-5">
                    <div class="shrink-0">
                        <img class="size-10 rounded-full" src="../../assets/img/profile.jpg" alt="" />
                    </div>
                    <div class="ml-3">
                        <div class="text-base font-medium text-white">Tom Cook</div>
                        <div class="text-sm font-medium text-gray-400">tom@example.com</div>
                    </div>
                    <!-- <button type="button" class="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span class="absolute -inset-1.5" />
                        <span class="sr-only">View notifications</span>
                        <BellIcon class="size-6" aria-hidden="true" />
                    </button> -->
                </div>
            </div>
            <div class="space-y-1 px-2 pt-2 pb-3">
                <router-link v-for="page in pages" :key="page.name" :to="page.url" class="block rounded-md px-3 py-2 text-base font-medium" :class="$route.path == page.url ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'">
                    {{ __(page.name) }}
                </router-link>
            </div>
        </DisclosurePanel>
    </Disclosure>
</template>

<style>
nav[data-headlessui-state="open"] {
    height: 100%;
}
</style>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Bars3Icon, BellIcon, XMarkIcon, ExclamationCircleIcon, LanguageIcon } from "@heroicons/vue/24/outline";

import WizarrLogo from "@/components/WizarrLogo.vue";
import LanguageSelector from "@/components/Buttons/LanguageSelector.vue";
import ThemeToggle from "@/components/Buttons/ThemeToggle.vue";
import HelpButton from "@/components/Buttons/HelpButton.vue";

const pages = [
    { name: "Home", url: "/admin" },
    { name: "Invitations", url: "/admin/invitations" },
    { name: "Servers", url: "/admin/servers" },
    { name: "Users", url: "/admin/users" },
    { name: "Settings", url: "/admin/settings" },
];

const menuItems = [
    { text: "Your Profile", icon: "fa-user" },
    { text: "Settings", icon: "fa-gear" },
    { text: "Logout", icon: "fa-right-from-bracket" },
];
</script>
