import { Response } from 'express';
import { BadRequestError, ForbiddenError, NotFoundError } from 'routing-controllers';

import { logger } from '../utils/logger.util';

export abstract class BaseController {
  public ok<T>(res: Response, dto: T): Response<T> {
    return res.status(200).json(dto);
  }

  public created<T>(res: Response, dto: T): Response<T> {
    return res.status(201).json(dto);
  }

  public fail(res: Response, error: any): Response {
    logger('', `${ res.req.method } ${ res.req.path }
"params": ${ JSON.stringify(res.req.params, null, 4) }
"query": ${ JSON.stringify(res.req.query, null, 4) }
"body": ${ JSON.stringify(res.req.body, null, 4) }
"error": ${ JSON.stringify(error, null, 4) }
    `);

    return res.status(500).json({ message: error.message });
  }

  public error(res: Response, error: NotFoundError | BadRequestError | ForbiddenError) {
    if (!error.httpCode) {
      return this.fail(res, error);
    }

    return res.status(error.httpCode).json(error);
  }
}
