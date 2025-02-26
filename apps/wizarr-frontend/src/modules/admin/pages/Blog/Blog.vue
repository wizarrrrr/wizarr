<template>
    <AdminTemplate :header="__('Blog')" :subheader="__('Community Blog')" :box-view="false">
        <template #header>
            <div class="hidden md:block">
                <FormKit
                    id="searchBlogs"
                    @input="(value) => console.log(value)"
                    :classes="{
                        input: { 'focus:ring-0': true },
                        outer: { '!mb-0': true },
                    }"
                    type="search"
                    :placeholder="__('Search') + '...'"
                    prefix-icon="fa-search !text-gray-500" />
            </div>
        </template>
        <template #default>
            <div class="flex flex-row justify-between">
                <div class="hidden md:block mr-4">
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
import AdminTemplate from "@/templates/AdminTemplate.vue";
import BlogPostList from "../../components/Blog/BlogPostList/BlogPostList.vue";
import BlogSidebar from "../../components/Blog/BlogSidebar.vue";
</script>
