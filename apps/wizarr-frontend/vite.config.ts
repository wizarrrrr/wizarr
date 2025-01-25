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
        sourcemap: true,
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
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
                api: "modern-compiler"
            }
        },
        postcss: {
            plugins: [
                tailwindcss(tailwindConfig), // Initialize TailwindCSS
                autoprefixer, // Initialize Autoprefixer
            ],
        },
    },
});