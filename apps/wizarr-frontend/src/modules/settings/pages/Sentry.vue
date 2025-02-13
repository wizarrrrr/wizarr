<template>
    <div :class="bordered" class="p-6">
        <!-- Section Title -->
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ __("Why We Use Bug Reporting") }}
        </h2>

        <!-- Introduction Paragraph -->
        <p class="text-gray-700 dark:text-gray-200 mb-3">
            {{ __("We value the security, stability, and performance of our services. Bug reporting is a key component of ensuring that we deliver the best experience possible.") }}
            {{ __("By reporting bugs, you help us quickly identify and resolve any issues that might arise.") }}
        </p>

        <!-- Why Bug Reporting is Essential -->
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ __("Key Benefits of Bug Reporting:") }}</h3>
            <ul class="list-disc pl-8 mt-2 space-y-2">
                <li class="text-gray-600 dark:text-gray-200">{{ __("Error Monitoring") }}: {{ __("Helps us track and fix issues in real-time, ensuring a smooth user experience.") }}</li>
                <li class="text-gray-600 dark:text-gray-200">{{ __("Proactive Issue Resolution") }}: {{ __("Enables us to identify problems early before they affect your experience.") }}</li>
                <li class="text-gray-600 dark:text-gray-200">{{ __("Performance Optimization") }}: {{ __("Pinpoints bottlenecks and helps us optimize application performance.") }}</li>
                <li class="text-gray-600 dark:text-gray-200">{{ __("User Experience Improvement") }}: {{ __("Feedback helps us adapt our services to meet your needs more effectively.") }}</li>
            </ul>
        </div>

        <!-- Privacy Assurance -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ __("Your Privacy Matters:") }}</h3>
            <p class="text-gray-600 dark:text-gray-200">
                {{ __("We want to assure you that our bug reporting system is designed with privacy in mind. It only collects technical data related to errors, such as error messages, stack traces, and browser details. No personal data is collected or stored.") }}
            </p>
        </div>

        <!-- Bug Reporting Configuration -->
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ __("Configure Bug Reporting Settings") }}</h3>
        <p class="text-gray-500 dark:text-gray-100 mb-3">
            {{ __("You can enable or disable different types of monitoring and bug reporting. Customize your preferences below.") }}
        </p>

        <!-- Frontend and Backend Bug Reporting Options Side by Side -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <!-- Frontend Bug Reporting Options -->
            <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ __("Frontend Bug Reporting Options") }}</h4>
                <div class="space-y-4">
                    <FormKit v-model="isFrontendErrorMonitoring" type="checkbox" :label="__('Error Monitoring')" :value="true" :unchecked-value="false" />
                    <FormKit v-model="isFrontendPerformanceMonitoring" type="checkbox" :label="__('Performance Monitoring')" :value="true" :unchecked-value="false" />
                    <FormKit v-model="isFrontendTransactionMonitoring" type="checkbox" :label="__('Transaction Monitoring')" :value="true" :unchecked-value="false" />
                    <FormKit v-model="isFrontendSessionTracking" type="checkbox" :label="__('Session Tracking')" :value="true" :unchecked-value="false" />
                </div>
            </div>

            <!-- Backend Bug Reporting Options -->
            <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ __("Backend Bug Reporting Options") }}</h4>
                <div class="space-y-4">
                    <FormKit v-model="isBackendErrorMonitoring" type="checkbox" :label="__('Error Monitoring')" :value="true" :unchecked-value="false" />
                    <FormKit v-model="isBackendPerformanceMonitoring" type="checkbox" :label="__('Performance Monitoring')" :value="true" :unchecked-value="false" />
                    <FormKit v-model="isBackendTransactionMonitoring" type="checkbox" :label="__('Transaction Monitoring')" :value="true" :unchecked-value="false" />
                    <FormKit v-model="isBackendSessionTracking" type="checkbox" :label="__('Session Tracking')" :value="true" :unchecked-value="false" />
                </div>
            </div>
        </div>

        <!-- Save Button using FormKit -->
        <FormKit @submit="saveSettings" type="submit" :label="__('Save Settings')" />

        <!-- Troubleshooting Section -->
        <div class="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mt-6">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ __("Having Trouble?") }}</h4>
            <p class="text-gray-600 dark:text-gray-200">
                {{ __("If you're encountering issues with the bug reporting feature, please reach out to our support team. We're here to help!") }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useInformationStore } from "@/stores/information";
import { mapState, mapWritableState } from "pinia";

export default defineComponent({
    name: "Sentry",
    data() {
        return {
            // Frontend Bug Reporting Options
            isFrontendErrorMonitoring: true,
            isFrontendPerformanceMonitoring: true,
            isFrontendTransactionMonitoring: true,
            isFrontendSessionTracking: true,

            // Backend Bug Reporting Options
            isBackendErrorMonitoring: true,
            isBackendPerformanceMonitoring: true,
            isBackendTransactionMonitoring: true,
            isBackendSessionTracking: true,
        };
    },
    computed: {
        bordered() {
            return !this.boxView ? "border border-gray-200 dark:border-gray-700 rounded-md" : "";
        },
        ...mapWritableState(useInformationStore, ["bugReporting"]),
        ...mapState(useThemeStore, ["boxView"]),
    },
    methods: {
        async saveSettings() {
            const settings = {
                frontend: {
                    errorMonitoring: this.isFrontendErrorMonitoring,
                    performanceMonitoring: this.isFrontendPerformanceMonitoring,
                    transactionMonitoring: this.isFrontendTransactionMonitoring,
                    sessionTracking: this.isFrontendSessionTracking,
                },
                backend: {
                    errorMonitoring: this.isBackendErrorMonitoring,
                    performanceMonitoring: this.isBackendPerformanceMonitoring,
                    transactionMonitoring: this.isBackendTransactionMonitoring,
                    sessionTracking: this.isBackendSessionTracking,
                },
            };

            const response = await this.$axios.put("/api/information/settings", settings).catch(() => {
                this.$toast.error(this.__("Unable to save settings."));
            });

            if (!response) return;

            this.$toast.success(this.__("Bug reporting settings saved."));
        },
    },
    beforeCreate() {
        this.isFrontendErrorMonitoring = this.bugReporting?.frontend?.errorMonitoring ?? true;
        this.isFrontendPerformanceMonitoring = this.bugReporting?.frontend?.performanceMonitoring ?? true;
        this.isFrontendTransactionMonitoring = this.bugReporting?.frontend?.transactionMonitoring ?? true;
        this.isFrontendSessionTracking = this.bugReporting?.frontend?.sessionTracking ?? true;

        this.isBackendErrorMonitoring = this.bugReporting?.backend?.errorMonitoring ?? true;
        this.isBackendPerformanceMonitoring = this.bugReporting?.backend?.performanceMonitoring ?? true;
        this.isBackendTransactionMonitoring = this.bugReporting?.backend?.transactionMonitoring ?? true;
        this.isBackendSessionTracking = this.bugReporting?.backend?.sessionTracking ?? true;
    },
});
</script>

<style scoped>
/* Optional custom styling */
</style>
