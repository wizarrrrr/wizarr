<template>
    <AdminTemplate :header="__('Blog')" :subheader="__('Community Blog')" :align="false">
        <template #header>
            <FormKit type="button" data-theme="primary" :label="__('Back')" @click="router.push({ name: 'admin-blog' })" />
        </template>
        <template #default>
            <main class="w-full antialiased">
                <!-- Header -->
                <BlogPostHeader v-if="!loading" :header="blogPost.header" :subheader="blogPost.subheader" :tags="blogPost.tags" :cover="blogPost.cover" />
                <BlogPostHeaderSkeleton v-else />

                <div class="w-full mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div class="w-full relative flex justify-between gap-4 mx-auto mt-[-11rem] xl:mt-[-8rem] xl:mx-auto">
                        <!-- Content -->
                        <BlogPostContent v-if="!loading" :content="blogPost.content" :publishedAt="blogPost.rawPublishedAt" />
                        <BlogPostContentSkeleton v-else />

                        <!-- Sidebar -->
                        <BlogPostSidebar :loading="loading" :avatar="blogPost.authorAvatar" :name="blogPost.authorName" :title="blogPost.authorTitle" :bio="blogPost.authorBio" :location="blogPost.authorLocation" :createdAt="blogPost.authorCreatedAt" />
                    </div>
                </div>
            </main>
        </template>
    </AdminTemplate>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useFilter } from "@/plugins/filters";
import { useRouter, useRoute } from "vue-router";
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { useTitle } from "@vueuse/core";

import gql from "graphql-tag";
import AdminTemplate from "@/templates/AdminTemplate.vue";

import BlogPostHeader from "@/modules/admin/components/Blog/BlogPostHeader/BlogPostHeader.vue";
import BlogPostHeaderSkeleton from "@/modules/admin/components/Blog/BlogPostHeader/BlogPostHeaderSkeleton.vue";

import BlogPostContent from "@/modules/admin/components/Blog/BlogPostContent/BlogPostContent.vue";
import BlogPostContentSkeleton from "@/modules/admin/components/Blog/BlogPostContent/BlogPostContentSkeleton.vue";

import BlogPostSidebar from "@/modules/admin/components/Blog/BlogPostSidebar/BlogPostSidebar.vue";

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
                createdAt
                location {
                    latitude
                    longitude
                }
                bio
            }
            content {
                markdown
            }
            coverImage {
                altText
                url
            }
            tag {
                title
            }
            publishedAt
            id
            slug
            title
            excerpt
        }
    }
`;

// Use the query
const { result, loading, error } = useQuery(GET_POST, {
    slug: route.params.id,
});

// Extrapolate the values
const blogPost = computed(() => {
    if (!result.value) return {};
    return {
        header: result.value.post.title,
        subheader: result.value.post.excerpt,
        authorName: result.value.post.author.name !== null ? result.value.post.author.name : "Author Name",
        authorTitle: result.value.post.author.title !== null ? result.value.post.author.title : "Unknown",
        authorAvatar: result.value.post.author.picture.url !== null ? result.value.post.author.picture.url : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/author.png",
        authorLocation: result.value.post.author.location,
        authorCreatedAt: result.value.post.author.createdAt,
        authorBio: result.value.post.author.bio ? result.value.post.author.bio : `${result.value.post.author.name} has not provided a bio yet.`,
        cover: result.value.post.coverImage?.url ? result.value.post.coverImage.url : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/background.png",
        tags: result.value.post.tag ? result.value.post.tag : [],
        content: result.value.post.content.markdown,
        publishedAt: useFilter("timeAgo", result.value.post.publishedAt ? result.value.post.publishedAt : new Date()),
        rawPublishedAt: result.value.post.publishedAt ? result.value.post.publishedAt : new Date(),
    };
});

// Set page title
useTitle(computed(() => (blogPost.value.header ? `${blogPost.value.header} | Wizarr` : "Blog Post | Wizarr")));
</script>
