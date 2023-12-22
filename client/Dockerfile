FROM node:20-alpine

WORKDIR /knock-bank-web

COPY package.json yarn.lock /knock-bank-web/

RUN apk update && \
    yarn install

COPY . /knock-bank-web/

EXPOSE 5173

CMD ["yarn", "run", "dev", "--host", "0.0.0.0"]