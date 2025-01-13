#!/usr/bin/env bash

echo "Initializing Wizarr $WIZARR_SOURCE_REF"

export CPU_CORES="${CPU_CORES:=$(/usr/src/get-cpus.sh)}"
echo "Detected CPU Cores: $CPU_CORES"
if [ "$CPU_CORES" -gt 4 ]; then
  export UV_THREADPOOL_SIZE=$CPU_CORES
fi

/usr/sbin/nginx -g 'daemon off;' 2>&1
exec node /usr/src/app/server/src/main.js "$@"