import 'dotenv/config';
import 'reflect-metadata';
import express, { RequestHandler } from 'express';
import { urlencoded, json } from 'body-parser'

import { SERVER_PORT } from './src/constants'
import { Server } from './src/server';

import { User } from './src/modules/user/user.entity';
import { Group } from './src/modules/group/group.entity';

const app = express();
const server = new Server(app, SERVER_PORT);

const globalMiddleware: Array<RequestHandler> = [
  urlencoded({ extended: false }),
  json()
];

server.initDatabase([User, Group])
  .then(() => {
    server.loadMiddleware(globalMiddleware);
    server.loadControllers();
    server.run();
  })
  .catch(console.error);
