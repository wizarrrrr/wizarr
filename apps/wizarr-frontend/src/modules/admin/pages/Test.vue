<template>
    <AdminTemplate :header="__('Blog')" :subheader="__('Community Blog')" :align="false">
        <template #header>
            <FormKit type="button" data-theme="primary" :label="__('Back')" @click="router.push({ name: 'admin-blog' })" />
        </template>
        <template #default>
            <main class="mb-[150px] antialiased">
                <BlogPostHeader :loading="loading" :header="blogPost.header" :subheader="blogPost.subheader" :tags="blogPost.tags" :cover="blogPost.cover" />
                <div :class="blogPost.cover ? '-m-36 xl:-m-32 xl:p-9 mx-4' : ''" class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div class="flex relative z-20 justify-between p-6 mx-auto -m-36 xl:-m-32 xl:p-9 xl:mx-auto bg-white dark:bg-gray-800 rounded">
                        <article class="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                            <div class="flex items-start justify-between text-gray-500 dark:text-gray-400 text-base">
                                <address class="flex items-center mb-6 not-italic">
                                    <div class="inline-flex items-center text-sm text-gray-900 dark:text-white">
                                        <img class="!my-[0px] mr-4 w-16 h-16 rounded-md" :src="blogPost.authorAvatar" :alt="blogPost.authorName" />
                                        <div class="flex flex-col pb-2 gap-0">
                                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ blogPost.authorName }}</span>
                                            <span class="flex flex-col pt-1">
                                                <span class="font-bold text-gray-500 dark:text-gray-400">{{ blogPost.authorTitle }}</span>
                                                <span class="font-light italic leading-[1] text-xs text-gray-500 dark:text-gray-400">{{ __("Published %{time}", { time: blogPost.publishedAt || "Unknown" }) }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </address>
                                <time class="font-normal text-gray-500 dark:text-gray-400 uppercase" pubdate :datetime="blogPost.rawDate || ''" :title="blogPost.rawDateString || ''">{{ blogPost.rawDateStringWithTime }}</time>
                            </div>
                            <content class="text-base text-gray-900 dark:text-white">
                                <div v-if="blogPost.content" class="markdown bg-white dark:bg-gray-800">
                                    <VueMarkdown :source="blogPost.content" :plugins="plugins" :options="options" />
                                </div>
                            </content>
                        </article>
                        <aside class="hidden xl:block" aria-labelledby="sidebar-label">
                            <div class="xl:w-[336px] sticky top-6">
                                <h3 id="sidebar-label" class="sr-only">Sidebar</h3>
                                <div class="mb-8">
                                    <h4 class="mb-2 text-sm font-bold text-gray-900 dark:text-white uppercase">Flowbite News morning headlines</h4>
                                    <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">Get all the stories you need-to-know from the most powerful name in news delivered first thing every morning to your inbox</p>
                                    <button type="button" data-modal-target="newsletter-modal" data-modal-toggle="newsletter-modal" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 text-center w-full">Subscribe</button>
                                </div>
                                <div class="mb-12">
                                    <h4 class="mb-4 text-sm font-bold text-gray-900 dark:text-white uppercase">Latest news</h4>
                                    <div class="mb-6 flex items-center">
                                        <a href="#" class="shrink-0">
                                            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/image-1.png" class="mr-4 max-w-full w-24 h-24 rounded-lg" alt="Image 1" />
                                        </a>
                                        <div>
                                            <h5 class="mb-2 text-lg font-bold leading-tight dark:text-white text-gray-900">Our first office</h5>
                                            <p class="mb-2 text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone changes.</p>
                                            <a href="#" class="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline"> Read in 9 minutes </a>
                                        </div>
                                    </div>
                                    <div class="mb-6 flex items-center">
                                        <a href="#" class="shrink-0">
                                            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/image-2.png" class="mr-4 max-w-full w-24 h-24 rounded-lg" alt="Image 2" />
                                        </a>
                                        <div>
                                            <h5 class="mb-2 text-lg font-bold leading-tight dark:text-white text-gray-900">Enterprise Design tips</h5>
                                            <p class="mb-2 text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone changes.</p>
                                            <a href="#" class="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline"> Read in 14 minutes </a>
                                        </div>
                                    </div>
                                    <div class="mb-6 flex items-center">
                                        <a href="#" class="shrink-0">
                                            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/image-3.png" class="mr-4 max-w-full w-24 h-24 rounded-lg" alt="Image 3" />
                                        </a>
                                        <div>
                                            <h5 class="mb-2 text-lg font-bold leading-tight dark:text-white text-gray-900">Partnered up with Google</h5>
                                            <p class="mb-2 text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone changes.</p>
                                            <a href="#" class="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline"> Read in 9 minutes </a>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <a href="#" class="flex justify-center items-center mb-3 w-full h-48 bg-gray-100 rounded-lg dark:bg-gray-700">
                                        <svg aria-hidden="true" class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
                                    </a>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">Students and Teachers, save up to 60% on Flowbite Creative Cloud.</p>
                                    <p class="text-xs text-gray-400 uppercase dark:text-gray-500">Ads placeholder</p>
                                </div>
                            </div>
                        </aside>
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
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";
import { useTitle } from "@vueuse/core";

import type { Options } from "vue-markdown-render";

import gql from "graphql-tag";
import moment from "moment";
import AdminTemplate from "@/templates/AdminTemplate.vue";
import BlogPostHeader from "@/modules/admin/components/Blog/BlogPostHeader/BlogPostHeader.vue";
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
    slug: "test-blog-one", //route.params.id,
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
        cover: result.value.post.coverImage?.url ? result.value.post.coverImage.url : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/background.png",
        tags: result.value.post.tag ? result.value.post.tag : [],
        content: result.value.post.content.markdown,
        publishedAt: useFilter("timeAgo", result.value.post.publishedAt ? result.value.post.publishedAt : new Date()),
        // 2022-08-03
        rawDate: result.value.post.publishedAt ? moment(result.value.post.publishedAt).format("YYYY-MM-DD") : null,
        // August 3rd, 2022
        rawDateString: result.value.post.publishedAt ? moment(result.value.post.publishedAt).format("MMMM Do, YYYY") : null,
        // August 3rd, 2022, 2:20am EDT
        rawDateStringWithTime: result.value.post.publishedAt ? moment(result.value.post.publishedAt).format("MMMM Do, YYYY, h:mm a") : null,
    };
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

// Set page title
useTitle(computed(() => (blogPost.value.header ? `${blogPost.value.header} | Wizarr` : "Blog Post | Wizarr")));
</script>
