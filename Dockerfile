FROM node:20-alpine

# Fix zlib CRITICAL (CVE-2026-22184)
RUN apk upgrade --no-cache

# Fix npm bundled packages (tar, glob, minimatch, cross-spawn, diff, brace-expansion)
RUN npm install -g npm@latest

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend .

EXPOSE 3000

CMD ["node", "server.js"]