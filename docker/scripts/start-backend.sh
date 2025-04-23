#!/usr/bin/env sh

PROJECT_DIR="/usr/wizarr"
cd "$PROJECT_DIR" || exit

# Check for --dev in arguments
has_dev() {
    for arg in "$@"; do
        [ "$arg" = "--dev" ] && return 0
    done
    return 1
}

# Check for --prod in arguments
has_prod() {
    for arg in "$@"; do
        [ "$arg" = "--prod" ] && return 0
    done
    return 1
}

if has_dev "$@"; then
    echo "Development mode enabled"
elif has_prod "$@"; then
    echo "Development mode disabled"
fi

# Install node_modules if --dev
if [ ! -d "node_modules" ] && has_dev "$@"; then
    echo "node_modules not found. Running npm install..."
    npm install
fi

# Build if --dev
if [ ! -d "dist" ] && has_dev "$@"; then
    echo "dist folder not found. Running npm run build..."
    npm run build
fi

# Production mode
if has_prod "$@"; then
    echo "Running Wizarr Backend in production mode"
    exec node $PROJECT_DIR/apps/server/src/main.js "$@"
fi

# Development mode
if has_dev "$@"; then
    echo "Starting Wizarr Backend API"
    npm run start:backend

    # Wait for server
    until $(curl --output /dev/null --silent --head --fail http://localhost:5000); do
        printf '.'
        sleep 5
    done

    echo "Backend Server API started successfully"
    wait
fi