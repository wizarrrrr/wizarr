---
sidebar_position: 2
---

# Setup

:::note
If there's a feature you're planning to work on, just give us a heads up in [Discord](https://discord.wizarr.org) so we can:

1. Let you know if it's something we would accept into Wizarr
2. Provide any guidance on how something like that would ideally be implemented
3. Ensure nobody is already working on that issue/feature so we don't duplicate effort

Thanks for being interested in contributing 😊
:::

## Environment

### Services

This environment includes the services below. Additional details are available in each service's README.

-   Server - [`/apps/wizarr-backend`](https://github.com/wizarrrrr/wizarr/tree/main/apps/wizarr-backend)
-   Web app - [`/apps/wizarr-frontend`](https://github.com/wizarrrrr/wizarr/tree/main/apps/wizarr-frontend)
-   Redis
-   PostgreSQL development database with exposed port `5432` so you can use any database client to access it

All the services are packaged to run as with single Docker Compose command.

### Server and web app

1. Clone the project repo.
2. Run `cp docker/example.env docker/.env`.
3. Edit `docker/.env` to provide values for the required variable `STORAGE_LOCATION`.
4. From the root directory, run:

```bash title="Start development server"
npm install
npm run build
npm run start
```

5. Access the dev instance in your browser at http://localhost:3000

All the services will be started with hot-reloading enabled for a quick feedback loop.

You can access the web from `http://your-machine-ip:3000` or `http://localhost:3000`

**Notes:**

-   The "web" development container runs with uid 1000. If that uid does not have read/write permissions on the mounted volumes, you may encounter errors
-   In case of rootless docker setup, you need to use root within the container, otherwise you will encounter read/write permission related errors, see comments in `docker/docker-compose.dev.yml`.

## IDE setup

### Lint / format extensions

Setting these in the IDE give a better developer experience, auto-formatting code on save, and providing instant feedback on lint issues.

### VSCode

Install the recommended extensions.
