import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Wizarr',
  tagline: 'Server Managment Wizard',
  url: 'https://docs.wizarr.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'wizarrrrr', // Usually your GitHub org/user name.
  projectName: 'wizarr', // Usually your repo name.
  deploymentBranch: 'main',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    async function myPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
    require.resolve('docusaurus-lunr-search'),
  ],

  presets: [
    [
      'docusaurus-preset-openapi',
      {
        docs: {
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,

          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/wizarrrrr/wizarr/tree/main/docs/',
        },
        api: {
          path: '../open-api/wizarr-openapi-specs.json',
          routeBasePath: '/docs/api',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    announcementBar: {
      id: 'site_announcement_wizarr',
      content: `⚠️ The project is under <strong>very active</strong> development. Expect bugs and changes. Do not rely on it as a <strong>production</strong> tool!`,
      isCloseable: false,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: 'Wizarr',
      logo: {
        alt: 'Wizarr Logo',
        src: 'img/logo.svg',
        className: 'rounded',
      },
      items: [
        {
          to: '/docs/overview/introduction',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/roadmap',
          position: 'left',
          label: 'Roadmap',
        },
        {
          to: '/docs/api',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/wizarrrrr/wizarr',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.wizarr.org',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://features.wizarr.org',
          label: 'Feature Request',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Overview',
          items: [
            {
              label: 'Welcome',
              to: '/docs/overview/introduction',
            },
            {
              label: 'Installation',
              to: '/docs/install/requirements',
            },
            {
              label: 'Contributing',
              to: '/docs/overview/support-the-project',
            },
            {
              label: 'Privacy Policy',
              to: '/privacy-policy',
            },
          ],
        },
        {
          title: 'Documentation',
          items: [
            {
              label: 'Roadmap',
              to: '/roadmap',
            },
            {
              label: 'API',
              to: '/docs/api',
            }
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wizarrrrr/wizarr',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/@wizarr',
            },
            {
              label: 'Discord',
              href: 'https://discord.wizarr.org',
            },
            {
              label: 'Reddit',
              href: 'https://www.reddit.com/r/wizarr/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Wizarr, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      // additionalLanguages: ['sql', 'diff', 'bash', 'powershell', 'nginx'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
