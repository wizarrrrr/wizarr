<template>
    <div class="flex flex-col items-start space-y-4">
        <p class="w-full text-sm font-medium text-gray-900 dark:text-white">
            {{
                __("You're all set, click continue to get started and walkthrough how to use %{serverName}!", {
                    serverName: $filter("firstLetterUppercase", settings.server_type),
                })
            }}
        </p>
        <FormKit type="button" @click="$router.push('/help')" :classes="{ outer: 'w-full', input: 'w-full justify-center' }">
            {{ __("Start Walkthrough") }}
        </FormKit>
    </div>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { useInformationStore } from "@/stores/information";

export default defineComponent({
    name: "JoinCompleteView",
    computed: {
        ...mapState(useInformationStore, ["settings"]),
    },
    mounted() {
        console.log("mounted join complete view");
    },
});
</script>
@/stores/information
