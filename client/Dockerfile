FROM node:14 as base

ENV CLIENT_ROOT /client

RUN mkdir $CLIENT_ROOT
WORKDIR $CLIENT_ROOT

COPY ./package.json ./

RUN yarn

COPY . $CLIENT_ROOT

FROM base as production

RUN yarn build
