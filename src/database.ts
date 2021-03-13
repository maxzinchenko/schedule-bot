import { createConnection, EntitySchema } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, ENV } from './constants';

export const createDBConnection = (entities: Function[] | EntitySchema<any>[]) => createConnection({
  type: 'postgres',
  host: DB_HOST,
  port:  DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: `${ DB_NAME }_${ ENV }`,
  entities,
  synchronize: true,
  logging: true
});
