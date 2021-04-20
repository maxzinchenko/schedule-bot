export const SERVER_PORT = parseInt(process.env.SERVER_PORT!);

export const ENV = process.env.NODE_ENV;
export const PRODUCTION = ENV === 'production';

export const DB_NAME = process.env.POSTGRES_DB;
export const DB_PORT = parseInt(process.env.POSTGRES_PORT!);
export const DB_HOST = process.env.POSTGRES_HOST;
export const DB_USER = process.env.POSTGRES_USER;
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD;

export const MEMCACHED_ADDRESS = process.env.MEMCACHED_ADDRESS;

export const API_URL = process.env.API_URL;
export const API_USER_AGENT = process.env.API_USER_AGENT;
