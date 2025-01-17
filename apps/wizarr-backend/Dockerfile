# Use a specific base image from GitHub container registry for development environment
FROM ghcr.io/wizarrrrr/base-server-dev:main AS dev

# Set the working directory inside the container
WORKDIR /usr/src/

# Copy the current directory's content into the container
COPY ./* /usr/src/

# Install the dependencies with npm clean install
RUN npm ci

# Build the application using npm
RUN npm run build

# Install essential packages and utilities in the container
RUN apt-get update && \
    apt-get install -y \
    nginx \
    nmap \
    toilet \
    bash \
    figlet \
    curl \
    tini \
    && apt-get clean

# Set the working directory inside the container
WORKDIR /usr/wizarr/

# Prepare directories for app files
RUN mkdir /usr/wizarr/apps

# Copy shell scripts into the container
RUN mv /usr/src/docker/scripts/*.sh /usr/wizarr

# Move the frontend, backend, and libs to appropriate locations in the container
RUN mv /usr/src/dist/apps/wizarr-frontend /usr/wizarr/apps/web
RUN mv /usr/src/dist/apps/wizarr-backend /usr/wizarr/apps/server
RUN mv /usr/src/dist/libs /usr/wizarr/apps/libs
RUN mv /usr/src/modules /usr/wizarr
RUN mv /usr/src/*.json /usr/wizarr

# Husky wants .git and .husky folders
RUN mv -rf /usr/src/.git /usr/wizarr/.git
RUN mv -rf /usr/src/.husky /usr/wizarr/.husky

# Copy the custom nginx configuration file into the container
RUN mv /usr/src/docker/nginx-main.conf /etc/nginx/conf.d/wizarr.conf

# Remove default nginx configuration files
RUN rm -f /etc/nginx/conf.d/default.conf /etc/nginx/sites-enabled/default

# Copy a custom .bashrc file for the root user
RUN mv /usr/src/docker/scripts/.bashrc /root/.bashrc

# Make sure the .bashrc script is executable
RUN chmod +x /root/.bashrc

# Extract the version from package.json and set it as an environment variable
ARG PACKAGE_VERSION
RUN PACKAGE_VERSION=$(node -p "require('/usr/wizarr/package.json').version") && echo "Wizarr Version v" + $PACKAGE_VERSION

# Set build-related arguments (for versioning and tracking purposes)
ARG BUILD_ID
ARG BUILD_IMAGE
ARG BUILD_SOURCE_REF
ARG BUILD_SOURCE_COMMIT

# Set environment variables with information related to the build and source code
ENV WIZARR_BUILD=${BUILD_ID}
ENV WIZARR_BUILD_URL=https://github.com/wizarrrrr/wizarr/actions/runs/${BUILD_ID}
ENV WIZARR_BUILD_IMAGE=${BUILD_IMAGE}
ENV WIZARR_BUILD_IMAGE_URL=https://github.com/wizarrrrr/wizarr/pkgs/container/wizarr
ENV WIZARR_REPOSITORY=wizarrrrr/wizarr
ENV WIZARR_REPOSITORY_URL=https://github.com/wizarrrrr/wizarr
ENV WIZARR_SOURCE_REF=${BUILD_SOURCE_REF}
ENV WIZARR_SOURCE_COMMIT=${BUILD_SOURCE_COMMIT}
ENV WIZARR_SOURCE_URL=https://github.com/wizarrrrr/wizarr/commit/${BUILD_SOURCE_COMMIT}
ENV WIZARR_PACKAGE_VERSION=$PACKAGE_VERSION

# Empty /usr/src/ folder
RUN rm -rf /usr/src/*

# Expose port 5690 for external access
EXPOSE 5690

# Use tini to ensure proper signal handling
ENTRYPOINT ["tini", "--", "/bin/sh"]

# Default command to run when the container starts
CMD ["/usr/wizarr/start.sh"]

# Define a healthcheck command to monitor the container's health
HEALTHCHECK CMD wizarr-healthcheck
