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

ARG NGINX_VERSION="1.24.0"

###########################################
# nginx is enhanced with security modules #
# to generate nonces                      #
###########################################

FROM nginx:${NGINX_VERSION}-alpine AS builder

ARG NGINX_DEVEL_KIT_VERSION="0.3.2"
ARG NGINX_SET_MISC_MODULE_VERSION="0.33"

RUN wget "https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" && \
  wget "https://github.com/simpl/ngx_devel_kit/archive/v${NGINX_DEVEL_KIT_VERSION}.tar.gz" -O ngx_devel_kit-${NGINX_DEVEL_KIT_VERSION}.tar.gz && \
  wget "https://github.com/openresty/set-misc-nginx-module/archive/v${NGINX_SET_MISC_MODULE_VERSION}.tar.gz" -O set-misc-nginx-module-${NGINX_SET_MISC_MODULE_VERSION}.tar.gz;

RUN tar -zxvf nginx-${NGINX_VERSION}.tar.gz

WORKDIR /nginx-${NGINX_VERSION}

RUN tar -xzvf ../ngx_devel_kit-${NGINX_DEVEL_KIT_VERSION}.tar.gz && \
  tar -xzvf ../set-misc-nginx-module-${NGINX_SET_MISC_MODULE_VERSION}.tar.gz

RUN ls /

RUN apk add --no-cache --virtual .build-deps \
  gcc \
  libc-dev \
  make \
  openssl-dev \
  pcre-dev \
  zlib-dev \
  linux-headers \
  curl \
  gnupg \
  libxslt-dev \
  gd-dev \
  geoip-dev

WORKDIR /nginx-${NGINX_VERSION}

RUN echo `nginx -V 2>&1 | sed -n -e 's/^.*arguments: //p' | grep ssl`

RUN CONFARGS=$(nginx -V 2>&1 | sed -n -e 's/^.*arguments: //p') \
  CONFARGS=${CONFARGS/-Os -fomit-frame-pointer -g/-Os} && \
  SET_MISC_DIR="$(pwd)/set-misc-nginx-module-${NGINX_SET_MISC_MODULE_VERSION}" && \
  DEVEL_KIT_DIR="$(pwd)/ngx_devel_kit-${NGINX_DEVEL_KIT_VERSION}" && \
  ./configure \
    --with-compat $CONFARGS \
    --add-dynamic-module=${DEVEL_KIT_DIR} \
    --add-dynamic-module=${SET_MISC_DIR} && \
  make -j2 && \
  make install

###########################################
# artifact                                #
###########################################

FROM nginx:${NGINX_VERSION}-alpine

# - stop vulnerabilities:package CRITICAL Vulnerability found in os package type (APKG) - curl (fixed in: 7.87.0-r2)(CVE-2023-23914 - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-23914)
# - stop vulnerabilities:package HIGH Vulnerability found in os package type (APKG) - curl (fixed in: 7.87.0-r2)(CVE-2023-23916 - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-23916)
# - stop vulnerabilities:package CRITICAL Vulnerability found in os package type (APKG) - libcurl (fixed in: 7.87.0-r2)(CVE-2023-23914 - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-23914)
# - stop vulnerabilities:package HIGH Vulnerability found in os package type (APKG) - libcurl (fixed in: 7.87.0-r2)(CVE-2023-23916 - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-23916)
# - stop vulnerabilities:package HIGH Vulnerability found in os package type (APKG) - tiff (fixed in: 4.4.0-r2)(CVE-2022-3970 - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-3970)
RUN apk add --no-cache --upgrade curl libcurl tiff

COPY --from=builder /usr/lib/nginx/modules/ndk_http_module.so /etc/nginx/modules/ndk_http_module.so
COPY --from=builder /usr/lib/nginx/modules/ngx_http_set_misc_module.so /etc/nginx/modules/ngx_http_set_misc_module.so

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
