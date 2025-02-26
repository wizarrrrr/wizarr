<template>
    <div class="grid gap-4 lg:grid-cols-2">
        <template v-if="loading">
            <BlogPostItemSkeleton v-for="n in 3" />
        </template>
        <template v-else-if="error">
            <span>Error: {{ error.message }}</span>
        </template>
        <template v-else>
            <BlogPostItem v-for="(post, index) in blogPosts" :key="index" :tags="post.tags" :publishedAt="post.publishedAt" :title="post.title" :description="post.description" :authorName="post.authorName" :authorTitle="post.authorTitle" :authorAvatar="post.authorAvatar" :authorAvatarAlt="post.authorAvatarAlt" :link="post.link" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import gql from "graphql-tag";
import BlogPostItem from "./BlogPostItem.vue";
import BlogPostItemSkeleton from "./BlogPostItemSkeleton.vue";

import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

// Define Apollo Client
const apolloClient = new ApolloClient({
    uri: "https://eu-west-2.cdn.hygraph.com/content/cm794oacz001307w5uvanqvdo/master",
    cache: new InMemoryCache(),
});

// Provide Apollo Client to Vue app
provideApolloClient(apolloClient);

// GraphQL Query
const GET_POSTS = gql`
    query {
        posts(orderBy: createdAt_DESC, skip: 0, first: 10) {
            author {
                name
                picture {
                    url
                }
                id
                title
            }
            publishedAt
            slug
            title
            updatedAt
            excerpt
            coverImage {
                url
                altText
            }
            id
            tag {
                title
            }
        }
    }
`;

// Use the query
const { result, loading, error } = useQuery(GET_POSTS);

// Map the query result to the expected structure
const blogPosts = computed(() => {
    if (!result.value) return [];
    return result.value.posts.map((post: any) => ({
        tags: post.tag,
        publishedAt: post.publishedAt,
        title: post.title || "No title provided",
        description: post.excerpt || "No description provided",
        authorName: post.author?.name || "Anonymous",
        authorTitle: post.author?.title || "Member",
        authorAvatar: post.author?.picture?.url || "/images/avatar.png",
        authorAvatarAlt: post.author?.picture?.alt || "Avatar",
        link: `/admin/blog/${post.slug}`,
    }));
});
</script>
