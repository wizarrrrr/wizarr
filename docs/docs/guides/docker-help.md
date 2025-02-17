# Docker Help

## Containers

```bash
docker ps                         # see a list of running containers
docker ps -a                      # see a list of running and stopped containers
```

## Attach to a Container

```bash
docker exec -it <id or name> <command>          # attach to a container with a command
docker exec -it wizarr_server bash
docker exec -it wizarr_machine_learning bash
```

## Logs

```bash
docker logs <id or name>          # see the logs for a specific container (by id or name)

docker logs wizarr_server
docker logs wizarr_machine_learning
```

:::tip Follow a log
Adding `--follow` to a `docker logs <id or name>` command will stream new logs, instead of immediately exiting, which is often useful for debugging.
:::
