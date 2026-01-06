FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --legacy-peer-deps

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=build /app/.next ./.next
COPY public ./public
COPY next.config.ts ./next.config.ts
EXPOSE 3000
ENV PORT=3000
CMD ["npm","run","start","--","-H","0.0.0.0","-p","3000"]
