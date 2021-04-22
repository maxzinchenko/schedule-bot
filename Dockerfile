FROM node:14 as base

ENV ROOT /api

RUN mkdir $ROOT
WORKDIR $ROOT

COPY ./package.json ./

RUN yarn

COPY . $ROOT

FROM base as production

RUN yarn build
