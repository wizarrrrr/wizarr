import type { RouteRecordRaw } from "vue-router";

const children: RouteRecordRaw[] = [
    {
        path: "dashboard",
        name: "admin-home",
        component: () => import("../pages/Home.vue"),
        meta: {
            title: "Dashboard",
        },
    },
    {
        path: "invitations",
        name: "admin-invitations",
        component: () => import("../pages/Invitations.vue"),
        meta: {
            title: "Invitations",
        },
    },
    {
        path: "servers",
        name: "admin-servers",
        component: () => import("../pages/Servers.vue"),
        meta: {
            title: "Servers",
        },
    },
    {
        path: "users",
        name: "admin-users",
        component: () => import("../pages/Users.vue"),
        meta: {
            title: "Users",
        },
    },
    {
        path: "blog",
        name: "admin-blog",
        component: () => import("../pages/Blog/Blog.vue"),
        meta: {
            title: "Blog",
        },
    },
    {
        path: "blog/:id",
        name: "admin-blog-post",
        component: () => import("../pages/Blog/BlogPost.vue"),
    },
    {
        path: "flow-editor",
        name: "admin-flow-editor",
        component: () => import("../pages/FlowEditor.vue"),
    },
    {
        path: "test",
        name: "admin-test",
        component: () => import("../pages/Test.vue"),
    }
];

export default children;
