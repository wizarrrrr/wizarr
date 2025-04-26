<template>
    <div class="flex flex-col w-full text-sm text-gray-800 dark:text-gray-200 pt-2 px-6 pb-6 sm:px-8 sm:pb-8">
        <div>
            <div class="flex justify-between">
                <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li v-for="tab in tabs" :key="tab.id" class="me-2">
                        <a
                            href="#"
                            @click.prevent="tab.disabled ? null : (activeTab = tab.id)"
                            :class="{
                                'inline-block px-2 py-1 rounded hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white': true,
                                'text-white bg-blue-600': activeTab === tab.id,
                                'cursor-not-allowed text-gray-400 dark:text-gray-500': tab.disabled,
                            }"
                            :aria-current="activeTab === tab.id ? 'page' : undefined"
                            :disabled="tab.disabled">
                            {{ tab.name }}
                        </a>
                    </li>
                </ul>
                <label for="internal-postgres" class="inline-flex items-center cursor-pointer">
                    <input id="internal-postgres" type="checkbox" value="" class="sr-only peer" checked v-model="isInternalPostgres" aria-labelledby="internal-postgres" />
                    <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <div class="mt-4">
                <div v-if="activeTab === 1">
                    <div class="mt-4">
                        <form>
                            <transition name="expand">
                                <div v-if="!isInternalPostgres" id="expandable">
                                    <div class="mb-4">
                                        <label for="db-host" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Database Host</label>
                                        <input type="text" id="db-host" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600" placeholder="postgres" :value="isInternalPostgres ? 'postgres' : ''" :disabled="isInternalPostgres" />
                                    </div>
                                    <div class="mb-4">
                                        <label for="db-port" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Database Port</label>
                                        <input type="text" id="db-port" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600" placeholder="5432" :value="isInternalPostgres ? '5432' : ''" :disabled="isInternalPostgres" />
                                    </div>
                                    <div class="mb-4">
                                        <label for="db-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Database Name</label>
                                        <input type="text" id="db-name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600" placeholder="wizarr" :value="isInternalPostgres ? 'wizarr' : ''" :disabled="isInternalPostgres" />
                                    </div>
                                </div>
                            </transition>
                            <div class="mb-4">
                                <label for="db-user" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Database User</label>
                                <input type="text" id="db-user" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600" placeholder="postgres" value="postgres" />
                            </div>
                            <div class="mb-4">
                                <label for="db-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Database Password (default: postgres)</label>
                                <input type="password" id="db-password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600" placeholder="postgres" value="postgres" />
                            </div>
                        </form>
                    </div>
                </div>
                <div v-else-if="activeTab === 2">
                    <p>This is the content for Tab 2</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Tab {
    id: number;
    name: string;
    disabled?: boolean;
}

const tabs: Tab[] = [
    { id: 1, name: "PostgreSQL" },
    { id: 2, name: "SQLite", disabled: true },
];

const activeTab = ref<number>(1);
const isInternalPostgres = ref<boolean>(true);
</script>
