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

FROM docker.io/library/nginx:1.27.2-alpine-slim@sha256:e9293c9bedb0db866e7d2b69e58131db4c2478e6cd216cdd99b134830703983a

COPY --from=build "/tmp" "/"

ENV BASE_PATH="/"
ENV MODE="production"
ENV CONFIG_SRC="./config.json"
ENV HTTP_PORT="8080"
ENV NGINX_ENTRYPOINT_WORKER_PROCESSES_AUTOTUNE=1
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

# nginx user must own the cache and etc directory to write cache and tweak the nginx config
RUN chown -R nginx:0 /var/cache/nginx \
    && chmod -R go+w /var/cache/nginx \
    && chown -R nginx:0 /etc/nginx \
    && chmod -R go+w /etc/nginx

STOPSIGNAL SIGTERM

EXPOSE ${HTTP_PORT}

USER nginx
