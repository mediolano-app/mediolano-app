# ──────────────────────────────────────────────────────────────
# 1. build stage  ─ installs exact lockfile versions
# ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Re-create the app directory inside the container
WORKDIR /app

# Copy only the package manifests first (layer cache!)
COPY package*.json ./

# Deterministic install that ALSO ignores peer-dep conflicts
# If you later clean up the graph, just drop "--legacy-peer-deps"
RUN npm install --legacy-peer-deps

# Copy the rest of your source code
COPY . .

# Build the production bundle
RUN npm run build

# ──────────────────────────────────────────────────────────────
# 2. runtime stage  ─ minimal image that runs Next.js
# ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

# Create non-root user for security (optional but recommended)
RUN addgroup -S app && adduser -S app -G app
USER app

WORKDIR /app

# Copy only what’s needed to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 8080

# The container runs `next start`
CMD ["npm", "start"]