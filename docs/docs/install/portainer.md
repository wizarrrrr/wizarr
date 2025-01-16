---
sidebar_position: 50
---

# Portainer

Install Wizarr using Portainer's Stack feature.

1. Go to "**Stacks**" in the left sidebar.
2. Click on "**Add stack**".
3. Give the stack a name (i.e. wizarr), and select "**Web Editor**" as the build method.
4. Copy the content of the `docker-compose.yml` file from the [GitHub repository](https://github.com/wizarrrrr/wizarr/releases/latest/download/docker-compose.yml).
5. Replace `.env` with `stack.env` for all containers that need to use environment variables in the web editor.

6. Click on "**Advanced Mode**" in the **Environment Variables** section.

7. Copy the content of the `example.env` file from the [GitHub repository](https://github.com/wizarrrrr/wizarr/releases/latest/download/example.env) and paste into the editor.
8. Switch back to "**Simple Mode**".

-   Change the default `DB_PASSWORD`, and add custom database connection information if necessary.
-   Change `DATABASE_DIR` to a folder where the database will be saved to disk.
-   Change `UPLOAD_LOCATION` to a folder where media (uploaded and generated) will be stored.

11. Click on "**Deploy the stack**".

:::tip
For more information on how to use the application, please refer to the [Post Installation](/docs/install/post-install.mdx) guide.
:::
