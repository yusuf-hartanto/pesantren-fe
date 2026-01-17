# FROM node:22-alpine AS deps
# WORKDIR /app
# COPY package.json package-lock.json .npmrc ./
# RUN npm config set legacy-peer-deps true && npm ci --ignore-scripts --no-audit --no-fund || npm install --legacy-peer-deps --ignore-scripts --no-audit --no-fund

# FROM node:22-alpine AS build
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# COPY .env .env
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# RUN npm run build:icons && npm run build

# FROM node:22-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# COPY --from=build /app/.next/standalone ./
# COPY --from=build /app/.next/static ./.next/static
# COPY --from=build /app/public ./public
# USER node
# EXPOSE 3000
# ENV PORT=3000
# CMD ["node","server.js"]



FROM node@sha256:a9cd9bac76cf2396abf14ff0d1c3671a8175fe577ce350e62ab0fc1678050176 AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --ignore-scripts --no-audit --no-fund
RUN rm -rf /tmp/* /var/tmp/*

FROM node@sha256:a9cd9bac76cf2396abf14ff0d1c3671a8175fe577ce350e62ab0fc1678050176 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build:icons && npm run build
RUN rm -rf /tmp/* /var/tmp/*

FROM node@sha256:a9cd9bac76cf2396abf14ff0d1c3671a8175fe577ce350e62ab0fc1678050176 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN rm -rf /tmp/* /var/tmp/*
USER node
EXPOSE 3000
CMD ["node","server.js"]
