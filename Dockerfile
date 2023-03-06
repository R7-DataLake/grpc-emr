FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache g++ python3

COPY . .

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

RUN pnpm i && pnpm run build

RUN rm -rf src

RUN rm -rf node_modules && pnpm i --production

FROM keymetrics/pm2:18-slim

COPY --from=builder /app /app

EXPOSE 50051

CMD ["pm2-runtime", "--json", "/app/process.json"]
