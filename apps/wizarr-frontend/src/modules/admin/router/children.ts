import type { RouteRecordRaw } from "vue-router";

const children: RouteRecordRaw[] = [
    {
        path: "dashboard",
        name: "admin-home",
        component: () => import("../pages/Home.vue"),
    },
    {
        path: "invitations",
        name: "admin-invitations",
        component: () => import("../pages/Invitations.vue"),
    },
    {
        path: "servers",
        name: "admin-servers",
        component: () => import("../pages/Servers.vue"),
    },
    {
        path: "users",
        name: "admin-users",
        component: () => import("../pages/Users.vue"),
    },
    {
        path: "blog",
        name: "admin-blog",
        component: () => import("../pages/Blog/Blog.vue"),
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
];

export default children;
