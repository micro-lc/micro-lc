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

ARG NGINX_VERSION="1.25.5"

FROM nginx:${NGINX_VERSION}-alpine

ARG COMMIT_SHA
ARG DESCRIPTION
ARG VERSION

LABEL name="micro-lc" \
      description=${DESCRIPTION} \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version=${VERSION}

COPY packages/orchestrator/dist /usr/static
COPY .docker/etc/nginx /etc/nginx
COPY .docker/usr/static /usr/static

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "[micro-lc]: ${COMMIT_SHA}" >> /etc/nginx/commit.sha

ENV BASE_PATH="/"
ENV MODE="production"
ENV CONFIG_SRC="./config.json"

RUN chown nginx /etc/nginx/nginx.conf
RUN chown -R nginx /etc/nginx/conf.d/*
RUN chown -R nginx /usr/static/*

STOPSIGNAL SIGTERM

EXPOSE 8080

USER nginx

CMD ["/bin/sh" , "-c" , "envsubst '$$BASE_PATH $$MODE $$CONFIG_SRC' < /etc/nginx/conf.d/default.conf >> /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
