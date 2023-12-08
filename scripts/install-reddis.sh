#!/bin/bash

# Make sure that the script is being executed with superuser privileges.
if [ "$(id -u)" != "0" ]; then
    echo "Please run this script as root"
    exit 1
fi

# Check if Redis is already installed
if [ -x "$(command -v redis-server)" ]; then
    echo "Redis is already installed"
    exit 0
fi

# Check that all dependent packages are installed
# wget, make, tar and gcc
if [ ! -x "$(command -v wget)" ] || [ ! -x "$(command -v make)" ] || [ ! -x "$(command -v tar)" ] || [ ! -x "$(command -v gcc)" ]; then
    echo "Please install wget, make, tar and gcc"
    exit 1
fi

# Download Redis source code
wget https://download.redis.io/redis-stable.tar.gz -P /tmp

# Extract Redis source code
tar xzf /tmp/redis-stable.tar.gz -C /tmp

# Compile Redis source code
make -C /tmp/redis-stable

# Install Redis
sudo make -C /tmp/redis-stable install
