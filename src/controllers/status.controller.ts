import { JsonController, Get, Res, Req } from 'routing-controllers';
import { Request, Response } from 'express';

import { BaseController } from './index';
import { StatusService } from '../services';

@JsonController('/status')
export class StatusController extends BaseController {
  private readonly statusService = new StatusService();

  @Get()
  public async get(@Req() _: Request, @Res() res: Response) {
    try {
      const status = await this.statusService.getStatus();

      return super.ok(res, status);
    } catch (error) {
      return super.fail(res, error);
    }
  }
}
