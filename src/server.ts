import { Application, RequestHandler } from 'express';
import { Connection, EntitySchema } from 'typeorm';
import { useExpressServer } from 'routing-controllers';
import http from 'http';

import { PRODUCTION } from './constants';
import { database } from './config/database.config';

export class Server {
  constructor(private readonly app: Application, private readonly port?: number) {
    this.app = app;
    this.port = port;
  }

  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`\nApi is up and running on port ${ this.port }\n`)
    });
  }

  public loadMiddleware(middleware: Array<RequestHandler>): void {
    middleware.forEach(mw => {
      this.app.use(mw);
    });
  };

  public loadControllers(): void {
    useExpressServer(this.app, {
      routePrefix: '/api/v1',
      controllers: [`${__dirname}/**/*.controller.${ PRODUCTION ? 'js' : 'ts' }`]
    });
  };

  public initDatabase(entities: Function[] | EntitySchema<any>[]): Promise<Connection> {
    return database.createConnection(entities)
  }
}
