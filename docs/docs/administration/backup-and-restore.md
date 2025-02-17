# Backup and Restore

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A [3-2-1 backup strategy](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/) is recommended to protect your data. You should keep copies of your database for a comprehensive backup solution. This page provides an overview on how to backup the database. A template bash script that can be run as a cron job is provided [here](/docs/guides/template-backup-script.md)

:::danger
The instructions on this page show you how to prepare your Wizarr instance to be backed up. You are still responsible for your own data and we take no liability.
:::

## Database

:::info
Refer to the official [postgres documentation](https://www.postgresql.org/docs/current/backup.html) for details about backing up and restoring a postgres database.
:::

:::caution
It is not recommended to directly backup the `DB_DIR` folder. Doing so while the database is running can lead to a corrupted backup that cannot be restored.
:::

### Automatic Database Backups

For convenience, Wizarr will automatically create database backups by default. The backups are stored in `STORAGE_DIR/backups`.  
As mentioned above, you should make your own backup of these as noted below.  
You can adjust the schedule and amount of kept backups in the [admin settings](http://wizarr.org/admin/system-settings?isOpen=backup).  
By default, Wizarr will keep the last 14 backups and create a new backup every day at 1:00 AM.

#### Restoring

We hope to make restoring simpler in future versions, for now you can find the backups in the `STORAGE_DIR/backups` folder on your host.  
Then please follow the steps in the following section for restoring the database.

### Manual Backup and Restore

<Tabs>
  <TabItem value="Linux system" label="Linux system" default>

```bash title='Backup'
docker exec -t wizarr_postgres pg_dumpall --clean --if-exists --username=postgres | gzip > "/path/to/backup/dump.sql.gz"
```

```bash title='Restore'
docker compose down -v  # CAUTION! Deletes all Wizarr data to start from scratch
## Uncomment the next line and replace DB_DIR with your Postgres path to permanently reset the Postgres database
# rm -rf DB_DIR # CAUTION! Deletes all Wizarr data to start from scratch
docker compose pull             # Update to latest version of Wizarr (if desired)
docker compose create           # Create Docker containers for Wizarr apps without running them
docker start wizarr_postgres    # Start Postgres server
sleep 10                        # Wait for Postgres server to start up
# Check the database user if you deviated from the default
gunzip < "/path/to/backup/dump.sql.gz" \
| sed "s/SELECT pg_catalog.set_config('search_path', '', false);/SELECT pg_catalog.set_config('search_path', 'public, pg_catalog', true);/g" \
| docker exec -i wizarr_postgres psql --dbname=postgres --username=<DB_USERNAME>  # Restore Backup
docker compose up -d            # Start remainder of Wizarr apps
```

</TabItem>
  <TabItem value="Windows system (PowerShell)" label="Windows system (PowerShell)">

```powershell title='Backup'
[System.IO.File]::WriteAllLines("C:\absolute\path\to\backup\dump.sql", (docker exec -t wizarr_postgres pg_dumpall --clean --if-exists --username=postgres))
```

```powershell title='Restore'
docker compose down -v  # CAUTION! Deletes all Wizarr data to start from scratch
## Uncomment the next line and replace DB_DIR with your Postgres path to permanently reset the Postgres database
# Remove-Item -Recurse -Force DB_DIR # CAUTION! Deletes all Wizarr data to start from scratch
## You should mount the backup (as a volume, example: `- 'C:\path\to\backup\dump.sql:/dump.sql'`) into the wizarr_postgres container using the docker-compose.yml
docker compose pull                               # Update to latest version of Wizarr (if desired)
docker compose create                             # Create Docker containers for Wizarr apps without running them
docker start wizarr_postgres                      # Start Postgres server
sleep 10                                          # Wait for Postgres server to start up
docker exec -it wizarr_postgres bash              # Enter the Docker shell and run the following command
# Check the database user if you deviated from the default. If your backup ends in `.gz`, replace `cat` with `gunzip`
cat < "/dump.sql" \
| sed "s/SELECT pg_catalog.set_config('search_path', '', false);/SELECT pg_catalog.set_config('search_path', 'public, pg_catalog', true);/g" \
| psql --dbname=postgres --username=<DB_USERNAME> # Restore Backup
exit                                              # Exit the Docker shell
docker compose up -d                              # Start remainder of Wizarr apps
```

</TabItem>
</Tabs>

Note that for the database restore to proceed properly, it requires a completely fresh install (i.e. the Wizarr server has never run since creating the Docker containers). If the Wizarr app has run, Postgres conflicts may be encountered upon database restoration (relation already exists, violated foreign key constraints, multiple primary keys, etc.), in which case you need to delete the `DB_DIR` folder to reset the database.
