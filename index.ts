import 'dotenv/config';
import express, { RequestHandler } from 'express';
import { urlencoded, json } from 'body-parser'

import { SERVER_PORT } from './src/constants'

import { Server } from './src/server';

import { User, Group } from './src/models';

const app = express();

const server = new Server(app, SERVER_PORT);

const globalMiddleware: Array<RequestHandler> = [
  urlencoded({ extended: false }),
  json()
];

server.initDatabase([User, Group])
  .then(() => {
    server.loadMiddleware(globalMiddleware);
    server.loadControllers('controllers');
    server.run();
  })
  .catch(console.error);
