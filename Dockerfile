# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090 \
    POCKETBASE_EMAIL=build@example.com \
    POCKETBASE_PASSWORD=build-dummy-password \
    npm run build && \
    npm prune --omit=dev

# Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache tzdata curl

ENV TZ=Europe/Amsterdam
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "build/index.js"]