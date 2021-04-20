FROM node:latest

WORKDIR /home/bot/server

COPY ./package*.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./

RUN yarn

COPY . ./

RUN yarn build

COPY ./dist ./

EXPOSE 3000
