# Base image Node dengan versi LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json & pnpm-lock.yaml ke container (sesuaikan kalau pakai yarn/npm)
COPY package.json pnpm-lock.yaml ./

# Install pnpm dan dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy semua source code ke container
COPY . .

# Build project (misal pakai bun build atau swc)
RUN bun build --target=node --outdir=dist src/server.ts

# Set environment variable kalau perlu (atau lewat docker-compose)
ENV NODE_ENV=production

# Port yang diekspos (sesuaikan app kamu)
EXPOSE 8004

# Jalankan migrate lalu start server
CMD ["sh", "-c", "pnpm run migrate:generate && pnpm run migrate:push && node dist/server.js"]
