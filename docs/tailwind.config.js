// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
        preflight: false, // disable Tailwind's reset
    },
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./{docs,blog}/**/*.{md,mdx}"], // my markdown stuff is in ../docs, not /src
    darkMode: ["class", '[data-theme="dark"]'], // hooks into docusaurus' dark mode settigns
    theme: {
        extend: {
            colors: {
                // Light Theme
                "wizarr-primary": "#4250af",
                "wizarr-bg": "#f9f8fb",
                "wizarr-fg": "black",
                "wizarr-gray": "#F6F6F4",

                // Dark Theme
                "wizarr-dark-primary": "#adcbfa",
                "wizarr-dark-bg": "#070a14",
                "wizarr-dark-fg": "#e5e7eb",
                "wizarr-dark-gray": "#212121",
            },
        },
    },
    plugins: [],
};
