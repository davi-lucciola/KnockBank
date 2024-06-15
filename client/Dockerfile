FROM node:20-alpine

WORKDIR /knock-bank-web

COPY package.json package-lock.json /knock-bank-web/

RUN apk update && \
    npm install

COPY . /knock-bank-web/

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]