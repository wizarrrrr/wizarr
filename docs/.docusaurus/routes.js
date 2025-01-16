import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/privacy-policy',
    component: ComponentCreator('/privacy-policy', '072'),
    exact: true
  },
  {
    path: '/roadmap',
    component: ComponentCreator('/roadmap', '687'),
    exact: true
  },
  {
    path: '/docs/api',
    component: ComponentCreator('/docs/api', '4c5'),
    routes: [
      {
        path: '/docs/api',
        component: ComponentCreator('/docs/api', 'bef'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/create-a-new-invitation',
        component: ComponentCreator('/docs/api/create-a-new-invitation', 'c41'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/create-a-new-server',
        component: ComponentCreator('/docs/api/create-a-new-server', '732'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/delete-a-server',
        component: ComponentCreator('/docs/api/delete-a-server', '86d'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/delete-an-invitation',
        component: ComponentCreator('/docs/api/delete-an-invitation', '29e'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-all',
        component: ComponentCreator('/docs/api/get-all', 'd61'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-all-1',
        component: ComponentCreator('/docs/api/get-all-1', 'b2b'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-all-2',
        component: ComponentCreator('/docs/api/get-all-2', 'c36'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-all-invitations',
        component: ComponentCreator('/docs/api/get-all-invitations', 'e4a'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-all-libraries',
        component: ComponentCreator('/docs/api/get-all-libraries', 'ae8'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-all-servers',
        component: ComponentCreator('/docs/api/get-all-servers', '933'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-all-users',
        component: ComponentCreator('/docs/api/get-all-users', '4bd'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-one',
        component: ComponentCreator('/docs/api/get-one', 'fbe'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-one-1',
        component: ComponentCreator('/docs/api/get-one-1', '06e'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-one-2',
        component: ComponentCreator('/docs/api/get-one-2', '6aa'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-one-invitation',
        component: ComponentCreator('/docs/api/get-one-invitation', 'bf7'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-one-library',
        component: ComponentCreator('/docs/api/get-one-library', '22a'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-one-server',
        component: ComponentCreator('/docs/api/get-one-server', 'f56'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/get-the-current-user',
        component: ComponentCreator('/docs/api/get-the-current-user', '1e8'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/health',
        component: ComponentCreator('/docs/api/health', 'c5c'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/introduction',
        component: ComponentCreator('/docs/api/introduction', '030'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/login-to-the-server-with-your-username-and-password',
        component: ComponentCreator('/docs/api/login-to-the-server-with-your-username-and-password', 'f0f'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/logout-of-the-server',
        component: ComponentCreator('/docs/api/logout-of-the-server', 'dd7'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/refresh-jwt-token',
        component: ComponentCreator('/docs/api/refresh-jwt-token', '15c'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/register-a-new-user',
        component: ComponentCreator('/docs/api/register-a-new-user', '93f'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/scan-for-libraries',
        component: ComponentCreator('/docs/api/scan-for-libraries', 'd5f'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/scan-for-libraries-on-a-specific-server',
        component: ComponentCreator('/docs/api/scan-for-libraries-on-a-specific-server', '8b0'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/scan-for-users',
        component: ComponentCreator('/docs/api/scan-for-users', '7cb'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/scan-for-users-on-a-specific-server',
        component: ComponentCreator('/docs/api/scan-for-users-on-a-specific-server', 'e17'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/server',
        component: ComponentCreator('/docs/api/server', 'd6f'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/supported-servers',
        component: ComponentCreator('/docs/api/supported-servers', '179'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/update-a-server',
        component: ComponentCreator('/docs/api/update-a-server', '50b'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/update-an-invitation',
        component: ComponentCreator('/docs/api/update-an-invitation', '0e3'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/update-information',
        component: ComponentCreator('/docs/api/update-information', 'e0a'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      },
      {
        path: '/docs/api/version',
        component: ComponentCreator('/docs/api/version', '394'),
        exact: true,
        sidebar: "openapi-sidebar-default"
      }
    ]
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'f74'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '80a'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'ad3'),
            routes: [
              {
                path: '/docs/administration/backup-and-restore',
                component: ComponentCreator('/docs/administration/backup-and-restore', '564'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/email-notification',
                component: ComponentCreator('/docs/administration/email-notification', '63e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/jobs-workers',
                component: ComponentCreator('/docs/administration/jobs-workers', 'cf8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/oauth',
                component: ComponentCreator('/docs/administration/oauth', 'ee4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/postgres-standalone',
                component: ComponentCreator('/docs/administration/postgres-standalone', '882'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/reverse-proxy',
                component: ComponentCreator('/docs/administration/reverse-proxy', 'c71'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/server-commands',
                component: ComponentCreator('/docs/administration/server-commands', '044'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/server-stats',
                component: ComponentCreator('/docs/administration/server-stats', '65f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/storage-template',
                component: ComponentCreator('/docs/administration/storage-template', 'd41'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/system-integrity',
                component: ComponentCreator('/docs/administration/system-integrity', '178'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/system-settings',
                component: ComponentCreator('/docs/administration/system-settings', '3b2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/administration/user-management',
                component: ComponentCreator('/docs/administration/user-management', 'e3b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/architecture',
                component: ComponentCreator('/docs/developer/architecture', 'ebd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/database-migrations',
                component: ComponentCreator('/docs/developer/database-migrations', '894'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/directories',
                component: ComponentCreator('/docs/developer/directories', 'b70'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/open-api',
                component: ComponentCreator('/docs/developer/open-api', 'a42'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/pr-checklist',
                component: ComponentCreator('/docs/developer/pr-checklist', '1c9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/setup',
                component: ComponentCreator('/docs/developer/setup', '22d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/testing',
                component: ComponentCreator('/docs/developer/testing', 'f8d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/translations',
                component: ComponentCreator('/docs/developer/translations', 'bda'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer/troubleshooting',
                component: ComponentCreator('/docs/developer/troubleshooting', '407'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/FAQ',
                component: ComponentCreator('/docs/FAQ', 'f74'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/custom-locations',
                component: ComponentCreator('/docs/guides/custom-locations', '3d6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/custom-map-styles',
                component: ComponentCreator('/docs/guides/custom-map-styles', '0f5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/database-gui',
                component: ComponentCreator('/docs/guides/database-gui', 'd74'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/database-queries',
                component: ComponentCreator('/docs/guides/database-queries', '31c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/docker-help',
                component: ComponentCreator('/docs/guides/docker-help', '976'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/external-library',
                component: ComponentCreator('/docs/guides/external-library', 'cdc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/python-file-upload',
                component: ComponentCreator('/docs/guides/python-file-upload', '6e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/remote-access',
                component: ComponentCreator('/docs/guides/remote-access', '18c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/remote-machine-learning',
                component: ComponentCreator('/docs/guides/remote-machine-learning', '6c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/scaling-immich',
                component: ComponentCreator('/docs/guides/scaling-immich', '970'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/smtp-gmail',
                component: ComponentCreator('/docs/guides/smtp-gmail', '7fd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/template-backup-script',
                component: ComponentCreator('/docs/guides/template-backup-script', '4f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/all-in-one',
                component: ComponentCreator('/docs/install/all-in-one', '42c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/config-file',
                component: ComponentCreator('/docs/install/config-file', 'ab2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/docker-compose',
                component: ComponentCreator('/docs/install/docker-compose', '6c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/environment-variables',
                component: ComponentCreator('/docs/install/environment-variables', '78a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/kubernetes',
                component: ComponentCreator('/docs/install/kubernetes', '7ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/portainer',
                component: ComponentCreator('/docs/install/portainer', '827'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/post-install',
                component: ComponentCreator('/docs/install/post-install', 'fa7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/requirements',
                component: ComponentCreator('/docs/install/requirements', 'ee3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/script',
                component: ComponentCreator('/docs/install/script', '8c2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/truenas',
                component: ComponentCreator('/docs/install/truenas', '937'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/install/unraid',
                component: ComponentCreator('/docs/install/unraid', '0d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/overview/help',
                component: ComponentCreator('/docs/overview/help', '82f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/overview/introduction',
                component: ComponentCreator('/docs/overview/introduction', '045'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/overview/quick-start',
                component: ComponentCreator('/docs/overview/quick-start', '9e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/overview/support-the-project',
                component: ComponentCreator('/docs/overview/support-the-project', '3f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
