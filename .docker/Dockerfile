# Copyright 2022 Mia srl
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# syntax=docker/dockerfile:1
FROM scratch AS build

COPY ".docker/" "/tmp/"
COPY "packages/orchestrator/dist" "/tmp/usr/static"

FROM docker.io/library/nginx:1.27.5-alpine-slim@sha256:b947b2630c97622793113555e13332eec85bdc7a0ac6ab697159af78942bb856

COPY --from=build "/tmp" "/"

ENV BASE_PATH="/"
ENV MODE="production"
ENV CONFIG_SRC="./config.json"
ENV HTTP_PORT="8080"
ENV NGINX_ENTRYPOINT_WORKER_PROCESSES_AUTOTUNE=1
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

# upgrade OS packages to pick up security fixes not yet in the base image
# nginx user must own the cache and etc directory to write cache and tweak the nginx config
RUN apk upgrade --no-cache \
    && chown -R nginx:0 /var/cache/nginx \
    && chmod -R go+w /var/cache/nginx \
    && chown -R nginx:0 /etc/nginx \
    && chmod -R go+w /etc/nginx

STOPSIGNAL SIGTERM

HEALTHCHECK --interval=5s --timeout=1s --retries=3 CMD wget -q --spider -O- http://localhost:${HTTP_PORT}

EXPOSE ${HTTP_PORT}

USER nginx
