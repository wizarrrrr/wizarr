<template>
    <!-- Navbar -->
    <NavigationBar />

    <!-- Page Content -->
    <div id="content" class="mt-[64px] mb-6">
        <RouterView />
    </div>

    <!-- Footer -->
    <AdminFooter />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import NavigationBar from "@/templates/NavigationBar.vue";
import AdminFooter from "@/templates/Footers/AdminFooter.vue";

export default defineComponent({
    name: "AdminView",
    components: {
        NavigationBar,
        AdminFooter,
    },
});
</script>
