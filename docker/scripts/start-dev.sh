#!/usr/bin/env bash

# Set the project directory
PROJECT_DIR="/usr/wizarr"

# Extract version from package.json
VERSION=$(grep '"version"' "$PROJECT_DIR/package.json" | sed -E 's/.*"version": *"([^"]+)".*/\1/')

# Check if jq extracted a valid version
if [ -z "$VERSION" ] || [ "$VERSION" == "null" ]; then
    echo "Failed to extract version from $PROJECT_DIR/package.json"
    exit 1
fi

# Export the version as an environment variable
export WIZARR_PACKAGE_VERSION="$VERSION"

echo "Initializing Wizarr v$WIZARR_PACKAGE_VERSION"

# Change to project directory
cd "$PROJECT_DIR" || exit

# Check if node_modules folder is missing
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Running npm install..."
    npm install
else
    echo "node_modules exists. Skipping npm install."
fi

# Check if dist folder is missing
if [ ! -d "dist" ]; then
    echo "dist folder not found. Running npm run build..."
    npm run build
else
    echo "dist folder exists. Skipping npm run build."
fi

# Start the project in development mode
npm run start
