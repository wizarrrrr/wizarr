import type { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
    {
        path: "/docs",
        alias: "/docs/:id",
        name: "docs",
        component: () => import("../views/DocsView.vue"),
    },
];

export default routes;
