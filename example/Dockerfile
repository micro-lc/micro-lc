FROM node:gallium-alpine as builder
COPY . /builder
WORKDIR /builder
RUN yarn install && yarn build

########################################################################################################################

FROM nginx:1.22.0-alpine as build

LABEL name="mia_template_service_name_placeholder" \
      description="%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%" \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version="0.1.0"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mia_template_service_name_placeholder: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY --from=builder /builder/build .

USER nginx
