import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger.util';

export const request = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger(
      'REQUEST',
      `
      method: ${ req.method },
      path: ${ req.path },
      body: ${ JSON.stringify(req.body, null, 2) },
      params: ${ JSON.stringify(req.params, null, 2) },
      ip: ${ req.ip },
      ips: ${ req.ips }
      `
    );

    next();
  }
};
