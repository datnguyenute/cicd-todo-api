# ---------- Stage 1: build ----------
# Có đủ devDependencies (TypeScript, Nest CLI) để compile
FROM node:24-alpine AS build
WORKDIR /app

# Copy package*.json TRƯỚC rồi mới npm ci → code đổi mà deps không đổi thì layer này được cache
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build \
 && npm prune --omit=dev

# ---------- Stage 2: runtime ----------
# Chỉ chứa thứ cần để CHẠY: JS đã build + deps production + migration
FROM node:24-alpine
WORKDIR /app

ARG APP_VERSION=dev
ENV NODE_ENV=production \
    APP_VERSION=${APP_VERSION} \
    PORT=8080

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/migrations ./migrations

# Không chạy bằng root
USER node
EXPOSE 8080
CMD ["node", "dist/main"]
