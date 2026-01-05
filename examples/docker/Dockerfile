FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY spec-snake.config.ts .

RUN npm ci

EXPOSE 3000

CMD ["npx", "spec-snake", "start"]
