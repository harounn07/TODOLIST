FROM node:20-alpine

RUN apk upgrade --no-cache

RUN npm install -g npm@latest

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend .

EXPOSE 3000

CMD ["node", "server.js"]