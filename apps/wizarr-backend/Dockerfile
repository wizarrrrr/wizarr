# web build
FROM node:20.18.1-alpine3.20@sha256:96cc8323e25c8cc6ddcb8b965e135cfd57846e8003ec0d7bcec16c5fd5f6d39f AS web

WORKDIR /usr/src/
COPY . .
RUN npm ci
RUN npm run build:frontend

# server build
FROM node:22.12.0-alpine3.20@sha256:96cc8323e25c8cc6ddcb8b965e135cfd57846e8003ec0d7bcec16c5fd5f6d39f AS server

WORKDIR /usr/src/
COPY . .
RUN npm ci
RUN npm run build:backend

# development
FROM ghcr.io/wizarrrrr/base-server-dev:main AS dev

RUN apt-get install --no-install-recommends -yqq tini
ENV PATH="${PATH}:/usr/src/app/bin"

WORKDIR /usr/src/

COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY --from=web /usr/src/dist/apps/wizarr-frontend /usr/src/app/web
COPY --from=web /usr/src/node_modules /usr/src/node_modules
COPY --from=server /usr/src/dist/apps/wizarr-backend /usr/src/app/server
COPY --from=server /usr/src/dist/libs /usr/src/app/libs

COPY docker/scripts/*.sh /usr/src
ENV PATH="${PATH}:/usr/src/bin"

ARG BUILD_ID
ARG BUILD_IMAGE
ARG BUILD_SOURCE_REF
ARG BUILD_SOURCE_COMMIT

ENV WIZARR_BUILD=${BUILD_ID}
ENV WIZARR_BUILD_URL=https://github.com/wizarrrrr/wizarr/actions/runs/${BUILD_ID}
ENV WIZARR_BUILD_IMAGE=${BUILD_IMAGE}
ENV WIZARR_BUILD_IMAGE_URL=https://github.com/wizarrrrr/wizarr/pkgs/container/wizarr
ENV WIZARR_REPOSITORY=wizarrrrr/wizarr
ENV WIZARR_REPOSITORY_URL=https://github.com/wizarrrrr/wizarr
ENV WIZARR_SOURCE_REF=${BUILD_SOURCE_REF}
ENV WIZARR_SOURCE_COMMIT=${BUILD_SOURCE_COMMIT}
ENV WIZARR_SOURCE_URL=https://github.com/wizarrrrr/wizarr/commit/${BUILD_SOURCE_COMMIT}

VOLUME /usr/src/app/storage
EXPOSE 5001
ENTRYPOINT ["tini", "--", "/bin/bash"]
CMD ["start.sh"]

HEALTHCHECK CMD wizarr-healthcheck
