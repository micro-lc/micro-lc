FROM node:gallium-alpine

LABEL name="mia-microlc-config-manager" \
      description="The Mia-Platform micro fontend solution configuration manager" \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version="0.8.0"

ENV LOG_LEVEL=info
ENV SERVICE_PREFIX=/
ENV HTTP_PORT=3000
ENV NODE_ENV=production
ENV PATH="${PATH}:/home/node/app/node_modules/.bin/"

WORKDIR /home/node/app

COPY package.json .
COPY yarn.lock .

COPY ./packages/core/package.json ./packages/core/package.json
COPY ./packages/core/dist ./packages/core/dist

COPY ./packages/be-config/package.json ./packages/be-config/package.json
COPY ./packages/be-config/dist ./packages/be-config/dist

RUN yarn be-config install --frozen-lockfile --ignore-scripts

USER node

CMD lc39 ./packages/be-config/dist/index.js --port "$HTTP_PORT" --log-level "$LOG_LEVEL" --prefix="$SERVICE_PREFIX"
