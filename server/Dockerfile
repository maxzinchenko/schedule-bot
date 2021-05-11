FROM node:14 as base

ENV SERVER_ROOT /server

RUN mkdir $SERVER_ROOT
WORKDIR $SERVER_ROOT

COPY ./package.json ./

RUN yarn

COPY . $SERVER_ROOT

FROM base as production

RUN yarn build
