#!/bin/bash

set -e  # Exit on error
set -u  # Treat unset variables as an error
set -o pipefail  # Catch errors in piped commands

# Ensure lolcat is installed
if ! command -v /usr/games/lolcat &> /dev/null; then
    echo "Installing lolcat for pretty colors... 🌈"
    sudo apt install -y lolcat
fi

# Wizarr Banner
clear
echo -e "\n"
echo -e "\n🚀 Starting Wizarr Development Environment Setup...\n" | /usr/games/lolcat

# Function to print messages with /usr/games/lolcat (if installed)
print_message() {
    local message="$1"
    if command -v /usr/games/lolcat &> /dev/null; then
        echo -e "$message" | /usr/games/lolcat
    else
        echo -e "$message"
    fi
}

# Update package lists
print_message "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential build tools
print_message "🛠 Installing essential build tools..."
sudo apt install -y curl wget build-essential libssl-dev

# Install NVM and Node.js 22.11.0
if ! command -v nvm &> /dev/null; then
    print_message "📦 Installing NVM..."
    curl -fsSL https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
else
    print_message "✅ NVM is already installed!"
fi

print_message "🟢 Installing Node.js 22.11.0..."
nvm install 22.11.0
nvm use 22.11.0
nvm alias default 22.11.0
print_message "📜 Node.js version: $(node -v)"

# Install Rust via rustup
if ! command -v rustc &> /dev/null; then
    print_message "🦀 Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    print_message "✅ Rust is already installed!"
fi

print_message "📜 Rust version: $(rustc --version)"

# Install PostgreSQL
print_message "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Check if systemd is available
if pidof systemd &> /dev/null; then
    print_message "🛠 Starting PostgreSQL with systemd..."
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
    sudo systemctl status postgresql --no-pager | /usr/games/lolcat
elif command -v service &> /dev/null; then
    print_message "🛠 Starting PostgreSQL with service command..."
    sudo service postgresql start
    sudo service postgresql status | /usr/games/lolcat
else
    print_message "⚠️ System is not using systemd or service. Please start PostgreSQL manually!"
fi


# Install Redis
print_message "🔥 Installing Redis..."
sudo apt-get install lsb-release curl gpg -y
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update -y
sudo apt-get install redis -y

# Start Redis based on init system
if pidof systemd &> /dev/null; then
    print_message "⚙️ Configuring Redis with systemd..."
    sudo systemctl enable redis
    sudo systemctl start redis
    sudo systemctl status redis --no-pager | /usr/games/lolcat
elif command -v service &> /dev/null; then
    print_message "⚙️ Starting Redis with service command..."
    sudo service redis-server start
    if pgrep -x "redis-server" > /dev/null; then
        print_message "Redis is running!"
    else
        print_message "⚠️ Please check that Redis is running manually!"
    fi
else
    print_message "⚠️ System is not using systemd or service. Please start Redis manually!"
fi

# Display final versions
print_message "\n🎉 Installation Complete! 🚀"
print_message "🟢 Node.js version: $(node -v)"
print_message "📦 NVM version: $(nvm --version)"
print_message "🦀 Rust version: $(rustc --version)"
print_message "🐘 PostgreSQL version: $(psql --version)"
print_message "🔥 Redis version: $(redis-server --version | awk '{print $3}')"

print_message "🎊 All tools are successfully installed! Happy coding! 🚀"
