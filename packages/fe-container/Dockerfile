FROM nginx:1.20.0-alpine as build

LABEL name="mia-microlc-website" \
      description="The Mia-Platform micro fontend solution" \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version="0.6.1"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mia-microlc: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY ./build .

USER nginx
