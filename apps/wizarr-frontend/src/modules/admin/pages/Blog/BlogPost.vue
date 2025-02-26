<template>
    <AdminTemplate :header="__('Blog')" :subheader="__('Community Blog')" :box-view="false">
        <template #header>
            <FormKit type="button" data-theme="primary" :label="__('Back')" @click="router.push({ name: 'admin-blog' })" />
        </template>
        <template #default>
            <div class="flex flex-row justify-between">
                <div class="hidden md:block mr-4">
                    <BlogSidebar />
                </div>
                <div class="w-full md:w-3/4">
                    <main v-if="loading" class="p-6 md:p-8 relative bg-white rounded shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 overflow-hidden antialiased">
                        <article class="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                            <header class="mb-4 lg:mb-6 not-format">
                                <address class="flex items-center mb-6 not-italic">
                                    <div class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                                        <!-- Skeleton for author image -->
                                        <div class="mr-4 w-16 h-16 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                                        <div class="flex flex-col">
                                            <!-- Skeleton for author name -->
                                            <div class="rounded h-5 w-32 bg-gray-300 dark:bg-gray-700 animate-pulse mb-2"></div>
                                            <!-- Skeleton for author title -->
                                            <div class="rounded h-4 w-24 bg-gray-300 dark:bg-gray-700 animate-pulse mb-2"></div>
                                            <!-- Skeleton for published date -->
                                            <div class="rounded h-3 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                                        </div>
                                    </div>
                                </address>
                                <!-- Skeleton for blog post title -->
                                <div class="rounded h-8 w-3/4 bg-gray-300 dark:bg-gray-700 animate-pulse mb-4 lg:mb-6"></div>
                                <!-- Skeleton for blog post content -->
                                <div class="space-y-4">
                                    <div class="rounded h-4 bg-gray-300 dark:bg-gray-700 animate-pulse w-full"></div>
                                    <div class="rounded h-4 bg-gray-300 dark:bg-gray-700 animate-pulse w-5/6"></div>
                                    <div class="rounded h-4 bg-gray-300 dark:bg-gray-700 animate-pulse w-4/6"></div>
                                    <div class="rounded h-4 bg-gray-300 dark:bg-gray-700 animate-pulse w-3/6"></div>
                                    <div class="rounded h-4 bg-gray-300 dark:bg-gray-700 animate-pulse w-5/6"></div>
                                </div>
                            </header>
                        </article>
                    </main>
                    <main v-else class="p-6 md:p-8 relative bg-white rounded shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 overflow-hidden antialiased">
                        <article class="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                            <header class="mb-4 lg:mb-6 not-format">
                                <address class="flex items-center mb-6 not-italic">
                                    <div class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                                        <img class="mr-4 w-16 h-16 rounded-md" :src="blogPost.author.picture.url" :alt="blogPost.author.picture.alt" />
                                        <div class="flex flex-col pb-2">
                                            <a href="#" rel="author" class="text-xl font-bold text-gray-900 dark:text-white">{{ blogPost.author.name }}</a>
                                            <p class="text-base text-gray-500 dark:text-gray-400">{{ blogPost.author.title }}</p>
                                            <p class="leading-[0.8] text-xs text-gray-500 dark:text-gray-400">{{ __("Published %{time}", { time: publishedAt }) }}</p>
                                        </div>
                                    </div>
                                </address>
                                <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">{{ blogPost.title }}</h1>
                                <content class="text-base text-gray-900 dark:text-white">
                                    <div class="markdown bg-white dark:bg-gray-800">
                                        <VueMarkdown :source="blogPost.content.markdown" :plugins="plugins" :options="options" />
                                    </div>
                                </content>
                            </header>
                        </article>
                    </main>
                </div>
            </div>
        </template>
    </AdminTemplate>
</template>
<style lang="scss">
content {
    h1 {
        @apply text-2xl font-bold leading-tight;
    }
    h2 {
        @apply text-xl font-bold leading-tight;
    }
}
</style>
<script lang="ts" setup>
import { computed } from "vue";
import { useFilter } from "@/plugins/filters";
import { useRouter, useRoute } from "vue-router";
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

import type { Options } from "vue-markdown-render";

import gql from "graphql-tag";
import AdminTemplate from "@/templates/AdminTemplate.vue";
import BlogSidebar from "../../components/Blog/BlogSidebar.vue";
import VueMarkdown from "vue-markdown-render";
import MarkdownItAnchor from "markdown-it-anchor";

const route = useRoute();
const router = useRouter();

// Define Apollo Client
const apolloClient = new ApolloClient({
    uri: "https://eu-west-2.cdn.hygraph.com/content/cm794oacz001307w5uvanqvdo/master",
    cache: new InMemoryCache(),
});

// Provide Apollo Client to Vue app
provideApolloClient(apolloClient);

// GraphQL Query
const GET_POST = gql`
    query getPost($slug: String!) {
        post(where: { slug: $slug }) {
            author {
                name
                id
                title
                picture {
                    altText
                    url
                }
            }
            content {
                markdown
            }
            publishedAt
            id
            slug
            title
        }
    }
`;

// Use the query
const { result, loading, error } = useQuery(GET_POST, {
    slug: route.params.id,
});

// Map the query result to the expected structure
const blogPost = computed(() => {
    if (!result.value) return {};
    return result.value.post;
});

// Compute the time ago
const publishedAt = computed(() => {
    return useFilter("timeAgo", blogPost.value.publishedAt);
});

// State definitions
const plugins = [MarkdownItAnchor];
const options: Options = {
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
};
</script>
