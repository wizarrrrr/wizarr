import type { RouteRecordRaw } from "vue-router";

const children: RouteRecordRaw[] = [
    {
        path: "",
        name: "admin-settings",
        component: () => import("../pages/Main.vue"),
        meta: {
            searchBar: true,
        },
    },
    {
        path: "media",
        name: "admin-settings-media",
        component: () => import("../pages/Media.vue"),
        meta: {
            header: "Media Servers",
            subheader: "Manage your media servers",
        },
    },
    {
        path: "requests",
        name: "admin-settings-requests",
        component: () => import("../pages/Requests.vue"),
        meta: {
            header: "Manage Requests",
            subheader: "Configure request server",
        },
    },
    {
        path: "apikeys",
        name: "admin-settings-apikeys",
        component: () => import("../pages/APIKeys.vue"),
        meta: {
            header: "Manage API Keys",
            subheader: "Configure API keys",
        },
    },
    {
        path: "webhooks",
        name: "admin-settings-webhooks",
        component: () => import("../pages/Webhooks.vue"),
        meta: {
            header: "Manage Webhooks",
            subheader: "Configure webhooks",
        },
    },
    {
        path: "account",
        name: "admin-settings-account",
        component: () => import("../pages/Account.vue"),
        meta: {
            header: "Manage Account",
            subheader: "Configure your account",
        },
    },
    {
        path: "smtp",
        name: "admin-settings-media",
        component: () => import("../pages/Email.vue"),
        meta: {
            header: "Email Server",
            subheader: "Configure Email Service",
        },
    },
    {
        path: "sessions",
        name: "admin-settings-sessions",
        component: () => import("../pages/Sessions.vue"),
        meta: {
            header: "Manage Sessions",
            subheader: "View and revoke your sessions",
        },
    },
    {
        path: "discord",
        name: "admin-settings-discord",
        component: () => import("../pages/Discord.vue"),
        meta: {
            header: "Manage Discord",
            subheader: "Configure Discord",
        },
    },
    {
        path: "logs",
        name: "admin-settings-logs",
        component: () => import("../pages/Logs.vue"),
        meta: {
            header: "View Logs",
            subheader: "View server logs",
        },
    },
    {
        path: "mfa",
        name: "admin-settings-mfa",
        component: () => import("../pages/Passkeys.vue"),
        meta: {
            header: "Manage MFA",
            subheader: "Configure multi-factor authentication",
        },
    },
    {
        path: "tasks",
        name: "admin-settings-tasks",
        component: () => import("../pages/Tasks.vue"),
        meta: { header: "Manage Tasks", subheader: "Configure server tasks" },
    },
    {
        path: "backup",
        name: "admin-settings-backup",
        component: () => import("../pages/Backup.vue"),
        meta: { header: "Backup Server", subheader: "Backup server data" },
    },
    {
        path: "about",
        name: "admin-settings-about",
        component: () => import("../pages/About.vue"),
        meta: { header: "About", subheader: "View server information" },
    },
    {
        path: "sentry",
        name: "admin-settings-sentry",
        component: () => import("../pages/Sentry.vue"),
        meta: { header: "Bug Reporting", subheader: "Configure bug reporting" },
    },
    {
        path: "membership",
        name: "admin-settings-membership",
        component: () => import("../pages/Membership.vue"),
        meta: {
            header: "Membership",
            subheader: "View Wizarr Cloud membership",
        },
    },
    {
        path: "support",
        name: "admin-settings-support",
        component: () => import("../pages/Support.vue"),
        meta: { header: "Live Support", subheader: "Get live support" },
    },
];

export default children;
