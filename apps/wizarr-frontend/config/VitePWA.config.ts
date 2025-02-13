import type { VitePWAOptions } from "vite-plugin-pwa";

const VitePWAConfig: Partial<VitePWAOptions> = {
    mode: "production",
    base: "/",
    includeAssets: ["favicon.ico"],
    selfDestroying: false,
    srcDir: "src/service",
    filename: "sw.ts",
    registerType: "autoUpdate",
    strategies: "injectManifest",
    workbox: {
        runtimeCaching: [
            {
                urlPattern: /\/.*\.(js|css)$/, // Matches any JS or CSS files (including dynamic chunks)
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "vue-dynamic-chunks-cache", // Cache name
                    expiration: {
                        maxEntries: 100, // Cache up to 100 chunks
                        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
                    },
                    cacheableResponse: {
                        statuses: [200], // Only cache successful responses
                    },
                },
            },
            {
                urlPattern: /\/api\/.*/, // Matches all API requests
                handler: "StaleWhileRevalidate", // Try the network first, fallback to cache if offline
                method: "GET", // Only cache GET requests
                options: {
                    cacheName: "api-cache", // Name of the cache storage
                    expiration: {
                        maxEntries: 100, // Limit cache to 100 API responses
                        maxAgeSeconds: 60 * 60, // Keep cached responses for 1 hour
                    },
                    cacheableResponse: {
                        statuses: [200], // Only cache successful responses
                    },
                },
            },
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/, // Matches image requests
                handler: "CacheFirst", // Uses cache before network
                options: {
                    cacheName: "image-cache", // Name of cache storage
                    expiration: {
                        maxEntries: 50, // Limit cache to 50 images
                        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
                    },
                },
            },
            {
                urlPattern: /\/fonts\//, // Matches font requests
                handler: "StaleWhileRevalidate", // Serves cached fonts while updating in background
                options: {
                    cacheName: "font-cache",
                },
            },
        ],
    },
    manifest: {
        name: "Wizarr",
        short_name: "Wizarr",
        theme_color: "#ff4155",
        background_color: "#111827",
        orientation: "portrait",
        display: "standalone",
        start_url: "/admin",
        scope: "/",
        description: "Wizarr is an advanced user invitation and management system for Jellyfin, Plex, Emby etc.",
        icons: [
            {
                src: "pwa-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/pwa-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "pwa-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
    },
    devOptions: {
        enabled: process.env.NODE_ENV !== "production",
        type: "module",
        navigateFallback: "index.html",
        suppressWarnings: false,
    },
};

export default VitePWAConfig;
