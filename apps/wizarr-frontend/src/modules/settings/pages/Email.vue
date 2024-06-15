<template>
    <FormKit type="form" :actions="false">
        <div class="sm:w-[398px] w-[444px]">
            <FormKit type="select" label="Send Mode" name="sendMode" :options="['Send via SMTP', 'Send Directly']" />
            <FormKit type="text" label="Sender Name" name="fromName" placeholder="Your mama" />
            <FormKit type="text" label="Sender Address" name="fromEmail" placeholder="your@email.com" />
            <FormKit type="select" label="Encryption Method" name="encryption" :options="['Use STARTTLS if available', 'Always Use STARTTLS', 'Use Implicit TLS']" />
        </div>
        <div class="grid grid-cols-[1fr_30px_1fr] w-fit place-items-center">
            <FormKit type="text" label="Host" name="smtpHost" class="w-full" />
            <span class="text-lg font-medium text-gray-900 dark:text-white h-fit"> : </span>
            <FormKit type="text" label="Port" name="smtpPort" />
        </div>
        <div class="mb-4">
            <FormKit type="checkbox" label="Use Authentication" name="useAuth" v-model="useAuth" />
        </div>
        <div class="grid grid-cols-[1fr_30px_1fr] w-fit place-items-center" v-if="useAuth">
            <FormKit type="text" label="Username" name="smtpHost" class="w-full" />
            <span class="text-lg font-medium text-gray-900 dark:text-white h-fit"> </span>
            <FormKit type="text" label="Password" name="smtpPort" />
        </div>
        <div class="flex gap-5">
            <button type="button" label="Test Connection" theme="secondary" class="hover:bg-secondary_hover focus:outline-none text-white font-medium rounded px-3.5 py-2 text-sm dark:bg-secondary dark:hover:bg-secondary_hover">Test Connection</button>
            <FormKit type="submit" label="Save" />
        </div>
    </FormKit>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "SettingsView",
    data() {
        return {
            useAuth: true,
            sendMode: "",
            encryption: "",
            smtpHost: "",
            smtpPort: "",
        };
    },
});
</script>
