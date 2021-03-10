import { Application, RequestHandler } from 'express';
import { createConnection, Connection, Entity } from 'typeorm';
import { useExpressServer } from 'routing-controllers';
import http from 'http';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, ENV } from './constants';

export class Server {
  constructor(private readonly app: Application, private readonly port?: number) {
    this.app = app;
    this.port = port;
  }

  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`Api is up and running on port ${this.port}`)
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

  public initDatabase(entities: typeof Entity[]): Promise<Connection> {
    return createConnection({
      type: 'postgres',
      host: DB_HOST,
      port:  DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: `${DB_NAME}_${ENV}`,
      entities,
      synchronize: true,
      logging: true
    });
  }
}
