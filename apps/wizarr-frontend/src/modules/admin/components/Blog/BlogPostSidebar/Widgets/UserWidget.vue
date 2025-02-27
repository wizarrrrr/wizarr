<template>
    <div class="max-w-[30vw] overflow-hidden p-6 mb-6 text-gray-500 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <a href="#" class="flex items-center mb-4">
            <div class="mr-3 shrink-0">
                <img class="mt-1 w-11 h-11 rounded" :src="avatar" :alt="name" />
            </div>
            <div class="mr-3">
                <div class="font-bold text-gray-900 dark:text-white line-clamp-1">{{ name }}</div>
                <div class="bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-0.5 text-xs">{{ title }}</div>
            </div>
        </a>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-4">
            {{ bio }}
        </p>
        <dl class="mb-5">
            <dt class="text-sm font-bold text-gray-900 uppercase dark:text-white">Location</dt>
            <dd class="mb-3 text-sm text-gray-500 dark:text-gray-400">{{ authorLocation }}</dd>
            <dt class="text-sm font-bold text-gray-900 uppercase dark:text-white">Joined</dt>
            <dd class="text-sm text-gray-500 dark:text-gray-400">{{ authorCreatedAt }}</dd>
        </dl>
        <FormKit type="button" data-theme="primary" :label="__('Follow')" :classes="{ input: 'w-full flex justify-center' }" disabled />
    </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useAxios } from "@/plugins/axios";

const axios = useAxios();

const props = defineProps<{
    avatar?: string;
    name?: string;
    title?: string;
    bio?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    createdAt?: Date;
}>();

const authorLocation = ref<string>("Unknown, Unknown");
const authorCreatedAt = computed(() => {
    return props.createdAt ? moment(props.createdAt).format("MMMM Do, YYYY") : null;
});

// Function to fetch location data
async function getLocationFromLatLong(latitude: number, longitude: number): Promise<string> {
    const response = await axios.get<{ city: string; principalSubdivision: string }>("https://api-bdc.net/data/reverse-geocode-client", {
        params: {
            latitude: latitude,
            longitude: longitude,
        },
        headers: {
            "Cache-Control": "max-age=3600",
        },
    });

    const { city: responseCity, principalSubdivision: responseSubdivision } = response.data;
    return `${responseCity}, ${responseSubdivision}`;
}

onMounted(async () => {
    if (props.location) {
        authorLocation.value = await getLocationFromLatLong(props.location.latitude, props.location.longitude);
    }
});
</script>
