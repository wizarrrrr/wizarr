<template>
    <div class="max-w-[30vw] overflow-hidden p-6 mb-6 text-gray-500 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <!-- Skeleton for Avatar and Name/Title -->
        <div class="flex items-center mb-4">
            <!-- Skeleton for Avatar -->
            <div class="mr-3 shrink-0">
                <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-11 h-11 rounded"></div>
            </div>
            <!-- Skeleton for Name and Title -->
            <div class="mr-3">
                <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-32 h-5 rounded mb-2"></div>
                <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-20 h-4 rounded"></div>
            </div>
        </div>

        <!-- Skeleton for Bio -->
        <div class="mb-4">
            <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-4 rounded mb-2"></div>
            <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-3/4 h-4 rounded mb-2"></div>
            <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-2/3 h-4 rounded mb-2"></div>
            <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-1/2 h-4 rounded"></div>
        </div>

        <!-- Skeleton for Location and Joined -->
        <dl class="mb-5">
            <!-- Skeleton for Location -->
            <dt class="text-sm font-bold text-gray-900 uppercase dark:text-white">
                <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-16 h-4 rounded mb-1"></div>
            </dt>
            <dd class="mb-3 text-sm text-gray-500 dark:text-gray-400">
                <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-24 h-4 rounded"></div>
            </dd>

            <!-- Skeleton for Joined -->
            <dt class="text-sm font-bold text-gray-900 uppercase dark:text-white">
                <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-16 h-4 rounded mb-1"></div>
            </dt>
            <dd class="text-sm text-gray-500 dark:text-gray-400">
                <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-24 h-4 rounded"></div>
            </dd>
        </dl>

        <!-- Skeleton for Button -->
        <div class="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-10 rounded"></div>
    </div>
</template>
