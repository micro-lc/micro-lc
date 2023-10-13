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

ARG NGINX_VERSION="1.25.1"

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

ARG NGINX_VERSION

FROM nginx:${NGINX_VERSION}-alpine

# - CVE-2023-2975    Unknown  libcrypto3-3.0.9-r1                      APKG     3.0.9-r2         https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-2975
# - CVE-2023-2975    Unknown  libssl3-3.0.9-r1                         APKG     3.0.9-r2         https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-2975
# - CVE-2023-3138    High     libx11-1.8.4-r0                          APKG     1.8.4-r1         https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-3138
# - CVE-2023-3316    Medium   tiff-4.4.0-r3                            APKG     4.4.0-r4         https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-3316
# - CVE-2023-35945   High     nghttp2-libs-1.51.0-r0                   APKG     1.51.0-r1        https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-35945
# - CVE-2023-38039   High     curl-8.2.1-r0                            APKG     8.3.0-r0         https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-38039
# - CVE-2023-38039   High     libcurl-8.2.1-r0                         APKG     8.3.0-r0         https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-38039
RUN apk add --no-cache --upgrade libcrypto3 libssl3 libx11 tiff nghttp2-libs curl libcurl

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
