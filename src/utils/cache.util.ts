import { memcached } from '../config/memcached.config';
import { logger } from './logger.util';

const LIFETIME = 86400; // 60 * 60 * 24

export const setCache = (key: string, value: any, cb: () => void) => {
  memcached.set(key, JSON.stringify(value), LIFETIME, error => {
    if (error) {
      logger('Memcached', JSON.stringify(error, null, 4));
    }

    cb();
  });
}

export const getCache = (key: string) => {
  return new Promise<any>(resolve => {
    memcached.get(key, (error, data) => {
      resolve(data ? JSON.parse(data) : null);
    });
  });
};
