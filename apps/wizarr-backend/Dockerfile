# Use a specific base image from GitHub container registry for development environment
FROM ghcr.io/wizarrrrr/base-server-dev:main AS dev

# Set the working directory inside the container
WORKDIR /usr/src/

# Copy the current directory's content into the container
COPY . .

# Install the dependencies with npm clean install
RUN npm ci

# Build the application using npm
RUN npm run build

# Install essential packages and utilities in the container
RUN apt-get update && \
    apt-get install --no-install-recommends -yqq \
    nginx  # Web server \
    nmap   # Network scanner tool \
    toilet # Terminal banner generator \
    figlet # Large text generator \
    curl   # Command-line tool for data transfer \
    tini   # Init system to handle signals properly \
    && apt-get clean

# Clean up unnecessary directories and prepare directories for app files
RUN rm -rf /usr/src/app && mkdir /usr/src/app

# Copy shell scripts into the container
COPY docker/scripts/*.sh /usr/src

# Move the frontend, backend, and libs to appropriate locations in the container
RUN mv /usr/src/dist/apps/wizarr-frontend /usr/src/app/web
RUN mv /usr/src/dist/apps/wizarr-backend /usr/src/app/server
RUN mv /usr/src/dist/libs /usr/src/app/libs

# Copy the custom nginx configuration file into the container
COPY docker/nginx-main.conf /etc/nginx/conf.d/wizarr.conf

# Remove default nginx configuration files
RUN rm -f /etc/nginx/conf.d/default.conf /etc/nginx/sites-enabled/default

# Copy a custom .bashrc file for the root user
COPY docker/scripts/.bashrc /root/.bashrc

# Make sure the .bashrc script is executable
RUN chmod +x /root/.bashrc

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

# Declare a volume for persistent storage
VOLUME /usr/src/app/storage

# Expose port 5690 for external access
EXPOSE 5690

# Set the entrypoint for the container to ensure proper signal handling
ENTRYPOINT ["tini", "--", "/bin/bash"]

# Default command to run when the container starts
CMD ["/usr/src/start.sh"]

# Define a healthcheck command to monitor the container's health
HEALTHCHECK CMD wizarr-healthcheck
