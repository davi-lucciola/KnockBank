# Build Stage
FROM node:20-alpine AS builder

WORKDIR /knockbank_web

COPY package.json package-lock.json  ./

RUN npm install

COPY src ./src
COPY public ./public
COPY next.config.mjs tailwind.config.ts postcss.config.mjs tsconfig.json ./

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Runtime Stage
FROM node:20-alpine as runtime

WORKDIR /knockbank_web

COPY --from=builder /knockbank_web/.next ./.next
COPY --from=builder /knockbank_web/public ./public
COPY --from=builder /knockbank_web/node_modules ./node_modules
COPY --from=builder /knockbank_web/package.json ./

EXPOSE 3000

CMD ["npm", "run", "start"]
