<template>
    <header class="bg-fixed w-full h-[400px] bg-no-repeat bg-cover bg-top bg-blend-darken relative">
        <!-- Gradient Overlay (Supports Light and Dark Mode) -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-gray-100/20 to-gray-100/100 dark:via-gray-900/50 dark:to-gray-900/100"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#99999924] dark:from-[#111827e0] to-transparent"></div>

        <!-- Skeleton Header Content -->
        <div class="w-full mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 absolute top-16 left-1/2 -translate-x-1/2">
            <!-- Skeleton for Tags -->
            <span class="block mb-4 text-gray-300 flex flex-row gap-1">
                <span class="animate-pulse text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200 w-16 h-6"></span>
                <span class="animate-pulse text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200 w-20 h-6"></span>
            </span>

            <!-- Skeleton for Title -->
            <h1 class="mb-4 max-w-4xl text-2xl font-extrabold leading-none text-white sm:text-3xl lg:text-4xl line-clamp-2 md:line-clamp-0">
                <span class="animate-pulse bg-gray-300 dark:bg-gray-700 w-3/4 h-8 block"></span>
            </h1>

            <!-- Skeleton for Sub Title -->
            <p class="max-w-[70%] text-lg font-normal text-gray-300 line-clamp-2 md:line-clamp-0">
                <span class="animate-pulse bg-gray-300 dark:bg-gray-700 w-1/2 h-6 block"></span>
                <span class="animate-pulse bg-gray-300 dark:bg-gray-700 w-2/3 h-6 block mt-2"></span>
            </p>
        </div>
    </header>
</template>