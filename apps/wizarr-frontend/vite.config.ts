/// <reference types='vitest' />

import { URL, fileURLToPath } from "node:url";

import { VitePWA } from "vite-plugin-pwa";
import VitePWAConfig from "./config/VitePWA.config";
import autoprefixer from "autoprefixer";
import babel from "vite-plugin-babel";
import { defineConfig } from "vite";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import svgLoader from "vite-svg-loader";
import tailwindConfig from "./tailwind.config";
import tailwindcss, { type Config } from "tailwindcss";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import markdownRawPlugin from "vite-raw-plugin";

export default defineConfig({
    clearScreen: true,
    cacheDir: "../../node_modules/.vite/wizarr",
    plugins: [
        vue(), // Initizalize Vue Plugin
        nxViteTsPaths(), // Initialize NX Vite TS Paths Plugin
        vueJsx(), // Initialize Vue JSX Plugin
        VitePWA(VitePWAConfig), // Initialize Vite PWA Plugin
        babel(), // Initialize Babel Plugin
        svgLoader(), // Initialize SVG Loader Plugin
        markdownRawPlugin({
            fileRegex: /\.md$/, // Initizalize Markdown Raw Plugin
        }),
    ],
    build: {
        target: process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",
        minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
    envPrefix: ["VITE_", "TAURI_ENV_*"],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5001",
                secure: false,
                changeOrigin: true,
                xfwd: true,
                rewrite: (path) => {
                    console.log(path);
                    return path;
                },
                configure: (proxy) => {
                    proxy.on("proxyRes", (proxyRes, req) => {
                        proxyRes.headers["test"] = "test";
                    });
                },
            },
            "/socket.io": {
                target: "ws://localhost:5001",
                secure: false,
                changeOrigin: true,
                xfwd: true,
                ws: true,
            },
            "/admin/bull": {
                target: "http://localhost:5001",
                secure: false,
                changeOrigin: true,
                xfwd: true,
            },
        },
        fs: {
            allow: [
                "../../node_modules/.vite/wizarr", // Allow Vite Cache
                "../../node_modules/.vitepress", // Allow Vitepress Cache
                "../../node_modules/.vite", // Allow Vite Cache
                "../../node_modules", // Allow Node Modules
                "../../", // Allow Root
                "../", // Allow Root
                "./", // Allow Root
            ],
        },
        watch: {
            usePolling: true,
        },
        allowedHosts: true,
    },
    preview: {
        port: 4300,
        host: "localhost",
    },
    test: {
        globals: true,
        cache: {
            dir: "../../node_modules/.vitest",
        },
        environment: "jsdom",
        include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
        postcss: {
            plugins: [
                // @ts-expect-error - TailwindCSS Plugin is weird
                tailwindcss(tailwindConfig), // Initialize TailwindCSS
                autoprefixer, // Initialize Autoprefixer
            ],
        },
    },
});
