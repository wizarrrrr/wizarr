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

# Install node_modules if --dev
if [ ! -d "node_modules" ] && has_dev "$@"; then
    echo "node_modules not found. Running npm install..."
    npm install
else
    echo "node_modules exists. Skipping npm install."
fi

# Build if --dev
if [ ! -d "dist" ] && has_dev "$@"; then
    echo "dist folder not found. Running npm run build..."
    npm run build
else
    echo "dist folder exists. Skipping npm run build."
fi

# Production mode
if has_prod "$@"; then
    echo "Running Wizarr Frontend in production mode"
    exec nginx -g "daemon off;"
fi

# Development mode
if has_dev "$@"; then
    echo "Starting Wizarr Frontend"
    npm run start:frontend &
    
    # Wait for server
    until curl --output /dev/null --silent --head --fail http://localhost:5173; do
        printf '.'
        sleep 5
    done
    echo "Frontend Server started successfully"
    wait
fi