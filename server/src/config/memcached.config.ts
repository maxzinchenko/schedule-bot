import Memcached from 'memcached';

import { MEMCACHED_ADDRESS } from '../constants';

export const memcached = new Memcached(MEMCACHED_ADDRESS, { retries: 10, retry: 10000, remove: true });
