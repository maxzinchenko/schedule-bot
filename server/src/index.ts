import 'dotenv/config';
import 'reflect-metadata';
import express, { RequestHandler } from 'express';
import { urlencoded, json } from 'body-parser'

import { SERVER_PORT } from './constants'
import { Server } from './server';

import { User } from './modules/user/user.entity';
import { Group } from './modules/group/group.entity';

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
