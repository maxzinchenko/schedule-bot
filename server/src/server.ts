import { Application, RequestHandler } from 'express';
import { Connection, EntitySchema } from 'typeorm';
import { useExpressServer } from 'routing-controllers';
import http from 'http';

import { createDBConnection } from './database';

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
    return middleware.forEach(mw => {
      this.app.use(mw);
    });
  };

  public loadControllers(folderName: string): void {
    useExpressServer(this.app, {
      routePrefix: '/api/v1',
      controllers: [`${__dirname}/${folderName}/*.ts`]
    });
  };

  public initDatabase(entities: Function[] | EntitySchema<any>[]): Promise<Connection> {
    return createDBConnection(entities)
  }
}
