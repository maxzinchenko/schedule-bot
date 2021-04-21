FROM node:14 as base

WORKDIR /home/bot

COPY ./package.json ./

RUN yarn

COPY . .

FROM base as production

RUN yarn build
