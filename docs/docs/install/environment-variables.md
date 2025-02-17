---
sidebar_position: 90
---

# Environment Variables

:::caution

To change environment variables, you must recreate the Wizarr containers.
Just restarting the containers does not replace the environment within the container!

In order to recreate the container using docker compose, run `docker compose up -d`.
In most cases docker will recognize that the `.env` file has changed and recreate the affected containers.
If this should not work, try running `docker compose up -d --force-recreate`.

:::

## Docker Compose

| Variable         | Description                     |  Default  | Containers |
| :--------------- | :------------------------------ | :-------: | :--------- |
| `WIZARR_VERSION` | Image tags                      | `release` | server     |
| `STORAGE_DIR`    | Host Path for uploads           |           | server     |
| `DB_DIR`         | Host Path for Postgres database |           | database   |

:::tip
These environment variables are used by the `docker-compose.yml` file and do **NOT** affect the containers directly.
:::

## General

| Variable                            | Description                                                   |    Default     | Containers | Workers       |
| :---------------------------------- | :------------------------------------------------------------ | :------------: | :--------- | :------------ |
| `TZ`                                | Timezone                                                      | <sup>\*1</sup> | server     | microservices |
| `WIZARR_ENV`                        | Environment (production, development)                         |  `production`  | server     | api           |
| `WIZARR_LOG_LEVEL`                  | Log Level (verbose, debug, log, warn, error)                  |     `log`      | server     | api           |
| `WIZARR_CONFIG_FILE`                | Path to config file                                           |                | server     | api           |
| `WIZARR_API_METRICS_PORT`           | Port for the OTEL metrics                                     |     `8081`     | server     | api           |
| `WIZARR_MICROSERVICES_METRICS_PORT` | Port for the OTEL metrics                                     |     `8082`     | server     | microservices |
| `WIZARR_PROCESS_INVALID_IMAGES`     | When `true`, generate thumbnails for invalid images           |                | server     | microservices |
| `WIZARR_TRUSTED_PROXIES`            | List of comma separated IPs set as trusted proxies            |                | server     | api           |
| `WIZARR_IGNORE_MOUNT_CHECK_ERRORS`  | See [System Integrity](/docs/administration/system-integrity) |                | server     | api           |

\*1: `TZ` should be set to a `TZ identifier` from [this list][tz-list]. For example, `TZ="Etc/UTC"`.
`TZ` is used by `exiftool` as a fallback in case the timezone cannot be determined from the image metadata. It is also used for logfile timestamps and cron job execution.

## Ports

| Variable      | Description    |     Default     |
| :------------ | :------------- | :-------------: |
| `WIZARR_HOST` | Listening host |    `0.0.0.0`    |
| `WIZARR_PORT` | Listening port | `5690` (server) |

## Database

| Variable                            | Description                                                              |   Default    | Containers                     |
| :---------------------------------- | :----------------------------------------------------------------------- | :----------: | :----------------------------- |
| `DB_URL`                            | Database URL                                                             |              | server                         |
| `DB_HOSTNAME`                       | Database Host                                                            |  `database`  | server                         |
| `DB_PORT`                           | Database Port                                                            |    `5432`    | server                         |
| `DB_USERNAME`                       | Database User                                                            |  `postgres`  | server, database<sup>\*1</sup> |
| `DB_PASSWORD`                       | Database Password                                                        |  `postgres`  | server, database<sup>\*1</sup> |
| `DB_NAME`                           | Database Name                                                            |   `wizarr`   | server, database<sup>\*1</sup> |
| `DB_VECTOR_EXTENSION`<sup>\*2</sup> | Database Vector Extension (one of [`pgvector`, `pgvecto.rs`])            | `pgvecto.rs` | server                         |
| `DB_SKIP_MIGRATIONS`                | Whether to skip running migrations on startup (one of [`true`, `false`]) |   `false`    | server                         |

\*1: The values of `DB_USERNAME`, `DB_PASSWORD`, and `DB_NAME` are passed to the Postgres container as the variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` in `docker-compose.yml`.

\*2: This setting cannot be changed after the server has successfully started up.

:::info

All `DB_` variables must be provided to all Wizarr workers, including `api` and `microservices`.

`DB_URL` must be in the format `postgresql://wizarrdbusername:wizarrdbpassword@postgreshost:postgresport/wizarrdatabasename`.
You can require SSL by adding `?sslmode=require` to the end of the `DB_URL` string, or require SSL and skip certificate verification by adding `?sslmode=require&sslmode=no-verify`.

When `DB_URL` is defined, the `DB_HOSTNAME`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` and `DB_NAME` database variables are ignored.

:::

## Redis

| Variable         | Description    | Default | Containers |
| :--------------- | :------------- | :-----: | :--------- |
| `REDIS_URL`      | Redis URL      |         | server     |
| `REDIS_SOCKET`   | Redis Socket   |         | server     |
| `REDIS_HOSTNAME` | Redis Host     | `redis` | server     |
| `REDIS_PORT`     | Redis Port     | `6379`  | server     |
| `REDIS_USERNAME` | Redis Username |         | server     |
| `REDIS_PASSWORD` | Redis Password |         | server     |
| `REDIS_DBINDEX`  | Redis DB Index |   `0`   | server     |

:::info
All `REDIS_` variables must be provided to all Wizarr workers, including `api` and `microservices`.

`REDIS_URL` must start with `ioredis://` and then include a `base64` encoded JSON string for the configuration.
More info can be found in the upstream [ioredis] documentation.

When `REDIS_URL` or `REDIS_SOCKET` are defined, the `REDIS_HOSTNAME`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD`, and `REDIS_DBINDEX` variables are ignored.
:::

Redis (Sentinel) URL example JSON before encoding:

<details>
<summary>JSON</summary>

```json
{
    "sentinels": [
        {
            "host": "redis-sentinel-node-0",
            "port": 26379
        },
        {
            "host": "redis-sentinel-node-1",
            "port": 26379
        },
        {
            "host": "redis-sentinel-node-2",
            "port": 26379
        }
    ],
    "name": "redis-sentinel"
}
```

</details>

## Prometheus

| Variable                   | Description                                                                                                           | Default | Containers | Workers |
| :------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :-----: | :--------- | :------ |
| `WIZARR_TELEMETRY_INCLUDE` | Collect these telemetries. List of `host`, `api`, `io`, `repo`, `job`. Note: You can also specify `all` to enable all |         | server     | api     |
| `WIZARR_TELEMETRY_EXCLUDE` | Do not collect these telemetries. List of `host`, `api`, `io`, `repo`, `job`                                          |         | server     | api     |

## Docker Secrets

The following variables support the use of [Docker secrets][docker-secrets] for additional security.

To use any of these, replace the regular environment variable with the equivalent `_FILE` environment variable. The value of
the `_FILE` variable should be set to the path of a file containing the variable value.

| Regular Variable | Equivalent Docker Secrets '\_FILE' Variable |
| :--------------- | :------------------------------------------ |
| `DB_HOSTNAME`    | `DB_HOSTNAME_FILE`<sup>\*1</sup>            |
| `DB_NAME`        | `DB_NAME_FILE`<sup>\*1</sup>                |
| `DB_USERNAME`    | `DB_USERNAME_FILE`<sup>\*1</sup>            |
| `DB_PASSWORD`    | `DB_PASSWORD_FILE`<sup>\*1</sup>            |
| `DB_URL`         | `DB_URL_FILE`<sup>\*1</sup>                 |
| `REDIS_PASSWORD` | `REDIS_PASSWORD_FILE`<sup>\*2</sup>         |

\*1: See the [official documentation][docker-secrets-docs] for
details on how to use Docker Secrets in the Postgres image.

\*2: See [this comment][docker-secrets-example] for an example of how
to use use a Docker secret for the password in the Redis container.

[tz-list]: https://en.wikipedia.org/wiki/List_of_tz_DB_time_zones#List
[docker-secrets-example]: https://github.com/docker-library/redis/issues/46#issuecomment-335326234
[docker-secrets-docs]: https://github.com/docker-library/docs/tree/master/postgres#docker-secrets
[docker-secrets]: https://docs.docker.com/engine/swarm/secrets/
[ioredis]: https://ioredis.readthedocs.io/en/latest/README/#connect-to-redis
