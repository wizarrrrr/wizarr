<template>
    <!-- Navbar -->
    <NavigationBar />

    <!-- Page Content -->
    <div id="content" class="mb-6">
        <Setttings />
    </div>

    <!-- Footer -->
    <AdminFooter />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import NavigationBar from "@/templates/NavigationBar.vue";
import AdminFooter from "@/templates/Footers/AdminFooter.vue";
import Setttings from "@/modules/admin/pages/Settings.vue";

export default defineComponent({
    name: "SettingsView",
    components: {
        NavigationBar,
        AdminFooter,
        Setttings,
    },
});
</script>
