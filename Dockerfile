# https://pnpm.io/docker#example-1-build-a-bundle-in-a-docker-container

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-slim As base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --chown=node:node . ./app
WORKDIR /app
USER node

# # RUN pnpm install --frozen-lockfile
# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build


###################
# PRODUCTION
###################

# Not Natively support ARM64 (M1)
FROM alpine:3.19 As production

ENV PORT=3333
ENV NODE_VERSION 20.11.0-r0
ENV NPM_VERSION 10.2.5-r0

# Make sure `"type": "module"` is set in package.json
COPY --from=build /app/package.json /app/package.json
# Production dependencies
# COPY --from=build /app/node_modules /app/node_modules
# Application
COPY --from=build /app/dist /app

# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app

RUN apk add --update --no-cache nodejs=$NODE_VERSION

# Clean up unnecessary files
# RUN apk add --update --no-cache \
#   # For getting node-prune
#   curl \
#   npm=$NPM_VERSION \
#   # We don't need package.json anymore
#   && rm -rf package.json \
#   # Clean up with https://github.com/tj/node-prune
#   && curl -sf https://gobinaries.com/tj/node-prune | sh \
#   # Prune non-used files
#   && npm prune --production \
#   # Remove node-prune
#   && rm -rf /usr/local/bin/node-prune \
#   && rm -rf node_modules/.cache/ \
#   # Remove cache
#   && rm -rf /root/.cache/ \
#   && rm -rf /root/.npm/ \
#   # Remove all unused dependecies
#   && apk del npm curl

EXPOSE ${PORT}

# Create a group and user
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node

USER node

CMD [ "node", "app/main.cjs" ]