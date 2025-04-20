# Use a specific base image from GitHub container registry for development environment
FROM node:22.12.0-bookworm AS build

# # Set the working directory inside the container
WORKDIR /usr/src/

# # Copy the current directory's content into the container
COPY . /usr/src/

# # Set a custom npm cache directory
RUN npm config set cache /tmp/.npm-cache --global

# # Perform clean installation with elevated permissions
RUN rm -rf node_modules
RUN npm ci

# # Build the application using npm
RUN npm run build

# # Use a specific base image from GitHub container registry for production environment
FROM ghcr.io/wizarrrrr/base-server-prod:main AS frontend-prod

# # Set the working directory inside the container
WORKDIR /usr/wizarr/

# # Copy the start script and make it executable
COPY ./docker/scripts/start-frontend.sh /usr/local/bin/start-frontend.sh
RUN chmod +x /usr/local/bin/start-frontend.sh

# Move the frontend to appropriate locations in the container
COPY --from=build /usr/src/dist/apps/wizarr-frontend /usr/wizarr/apps/web
COPY --from=build /usr/src/*.json /usr/wizarr/

# Copy the nginx configuration file and remove the default configuration
COPY ./docker/nginx-frontend.conf /etc/nginx/conf.d/wizarr.conf
RUN rm -f /etc/nginx/conf.d/default.conf /etc/nginx/sites-enabled/default

# Extract the version from package.json and set it as an environment variable
ARG PACKAGE_VERSION
RUN PACKAGE_VERSION=$(node -p "require('/usr/wizarr/package.json').version") \
	&& echo "Wizarr Version v" + "$PACKAGE_VERSION"

# Set build-related arguments (for versioning and tracking purposes)
ARG BUILD_ID
ARG BUILD_IMAGE
ARG BUILD_SOURCE_REF
ARG BUILD_SOURCE_COMMIT
ARG WIZARR_PACKAGE_VERSION

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

# Use tini to ensure proper signal handling
ENTRYPOINT ["tini", "--", "/bin/sh"]

# Default command to run when the container starts
CMD ["/usr/local/bin/start-frontend.sh", "--prod"]



# Use a specific base image from GitHub container registry for development environments
FROM ghcr.io/wizarrrrr/base-server-dev:main AS frontend-dev

# Set the working directory inside the container
WORKDIR /usr/wizarr/

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

# Use tini to ensure proper signal handling
ENTRYPOINT ["tini", "--", "/bin/sh"]

# Default command to run when the container starts
CMD ["/usr/local/bin/start-frontend.sh", "--dev"]