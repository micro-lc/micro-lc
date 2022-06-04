FROM nginx:1.22.0-alpine as build

LABEL name="mia-microlc-website" \
      description="The Mia-Platform micro fontend solution" \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version="0.8.0"

COPY nginx /etc/nginx

COPY ./start-scripts/* /docker-entrypoint.d/

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mia-microlc: $COMMIT_SHA" >> /etc/nginx/commit.sha \
  && chmod +x ./docker-entrypoint.d/*.sh \
  && chown nginx /etc/nginx/conf.d

WORKDIR /usr/static

COPY ./build .

USER nginx
