#!/usr/bin/env bash

echo "Initializing Wizarr v$WIZARR_PACKAGE_VERSION"

# Start Nginx in the background environment
nginx &

# Wait for Nginx to start
until $(curl --output /dev/null --silent --head --fail http://localhost:5690); do
    printf '.'
    sleep 5
done

echo "Nginx started successfully"

# Start the Backend Server API
exec node /usr/wizarr/apps/server/src/main.js "$@"