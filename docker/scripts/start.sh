#!/usr/bin/env bash

echo "Initializing Wizarr $WIZARR_SOURCE_REF"

export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/lib/jellyfin-ffmpeg/lib"

read_file_and_export() {
	if [ -n "${!1}" ]; then
		content="$(cat "${!1}")"
		export "$2"="${content}"
		unset "$1"
	fi
}
read_file_and_export "DB_URL_FILE" "DB_URL"
read_file_and_export "DB_HOSTNAME_FILE" "DB_HOSTNAME"
read_file_and_export "DB_DATABASE_NAME_FILE" "DB_DATABASE_NAME"
read_file_and_export "DB_USERNAME_FILE" "DB_USERNAME"
read_file_and_export "DB_PASSWORD_FILE" "DB_PASSWORD"
read_file_and_export "REDIS_PASSWORD_FILE" "REDIS_PASSWORD"

export CPU_CORES="${CPU_CORES:=$(./bin/get-cpus.sh)}"
echo "Detected CPU Cores: $CPU_CORES"
if [ "$CPU_CORES" -gt 4 ]; then
  export UV_THREADPOOL_SIZE=$CPU_CORES
fi

exec node /usr/src/app/server/src/main.js "$@"
