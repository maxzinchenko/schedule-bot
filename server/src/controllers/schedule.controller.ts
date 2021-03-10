import { JsonController, Get, QueryParams, Res } from 'routing-controllers';
import { Response } from 'express';

import { BaseController } from './index';
import { ScheduleService } from '../services';

@JsonController('/schedule')
export class StatusController extends BaseController {
  private readonly scheduleService = new ScheduleService();

  @Get()
  public async get(@QueryParams({ required: true }) query: any, @Res() res: Response) {
    try {
      const schedule = await this.scheduleService.getSchedule(query);

      return super.ok(res, schedule);
    } catch (error) {
      return super.fail(res, error);
    }
  }
}
