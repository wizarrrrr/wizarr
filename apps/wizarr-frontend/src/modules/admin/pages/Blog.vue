<template>
    <AdminTemplate :header="__('Blog')" :subheader="__('Community Blog')" :box-view="false">
        <template #header></template>
        <template #default>
            <div class="flex flex-col md:flex-row gap-1">
                <div class="hidden md:block w-1/4">
                    <BlogSidebar />
                </div>
                <div class="w-full md:w-3/4">
                    <BlogPostList />
                </div>
            </div>
        </template>
    </AdminTemplate>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import AdminTemplate from "@/templates/AdminTemplate.vue";
import BlogPostList from "../components/Blog/BlogPostList/BlogPostList.vue";
import BlogSidebar from "../components/Blog/BlogSidebar.vue";
</script>
