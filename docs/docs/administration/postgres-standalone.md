# Pre-existing Postgres

While not officially recommended, it is possible to run Wizarr using a pre-existing Postgres server. To use this setup, you should have a baseline level of familiarity with Postgres and the Linux command line. If you do not have these, we recommend using the default setup with a dedicated Postgres container.

By default, Wizarr expects superuser permission on the Postgres database and requires certain extensions to be installed. This guide outlines the steps required to prepare a pre-existing Postgres server to be used by Wizarr.

:::tip
Running with a pre-existing Postgres server can unlock powerful administrative features, including logical replication and streaming write-ahead log backups using programs like pgBackRest or Barman.
:::

## Prerequisites

You must install pgvecto.rs into your instance of Postgres using their [instructions][vectors-install]. After installation, add `shared_preload_libraries = 'vectors.so'` to your `postgresql.conf`. If you already have some `shared_preload_libraries` set, you can separate each extension with a comma. For example, `shared_preload_libraries = 'pg_stat_statements, vectors.so'`.

:::note
Wizarr is known to work with Postgres versions 14, 15, and 16. Earlier versions are unsupported. Postgres 17 is nominally compatible, but pgvecto.rs does not have prebuilt images or packages for it as of writing.

Make sure the installed version of pgvecto.rs is compatible with your version of Wizarr. The current accepted range for pgvecto.rs is `>= 0.2.0, < 0.4.0`.
:::

## Specifying the connection URL

You can connect to your pre-existing Postgres server by setting the `DB_URL` environment variable in the `.env` file.

```
DB_URL='postgresql://wizarrdbusername:wizarrdbpassword@postgreshost:postgresport/wizarrdatabasename'

# require a SSL connection to Postgres
# DB_URL='postgresql://wizarrdbusername:wizarrdbpassword@postgreshost:postgresport/wizarrdatabasename?sslmode=require'

# require a SSL connection, but don't enforce checking the certificate name
# DB_URL='postgresql://wizarrdbusername:wizarrdbpassword@postgreshost:postgresport/wizarrdatabasename?sslmode=require&sslmode=no-verify'
```

## With superuser permission

Typically Wizarr expects superuser permission in the database, which you can grant by running `ALTER USER <wizarrdbusername> WITH SUPERUSER;` at the `psql` console. If you prefer not to grant superuser permissions, follow the instructions in the next section.

## Without superuser permission

:::caution
This method is recommended for **advanced users only** and often requires manual intervention when updating Wizarr.
:::

:::danger
Currently, automated backups require superuser permission due to the usage of `pg_dumpall`.
:::

Wizarr can run without superuser permissions by following the below instructions at the `psql` prompt to prepare the database.

```sql title="Set up Postgres for Wizarr"
CREATE DATABASE <wizarrdatabasename>;
\c <wizarrdatabasename>
BEGIN;
ALTER DATABASE <wizarrdatabasename> OWNER TO <wizarrdbusername>;
CREATE EXTENSION vectors;
CREATE EXTENSION earthdistance CASCADE;
ALTER DATABASE <wizarrdatabasename> SET search_path TO "$user", public, vectors;
ALTER SCHEMA vectors OWNER TO <wizarrdbusername>;
COMMIT;
```

### Updating pgvecto.rs

When installing a new version of pgvecto.rs, you will need to manually update the extension by connecting to the Wizarr database and running `ALTER EXTENSION vectors UPDATE;`.

### Common errors

#### Permission denied for view

If you get the error `driverError: error: permission denied for view pg_vector_index_stat`, you can fix this by connecting to the Wizarr database and running `GRANT SELECT ON TABLE pg_vector_index_stat TO <wizarrdbusername>;`.

[vectors-install]: https://docs.pgvecto.rs/getting-started/installation.html