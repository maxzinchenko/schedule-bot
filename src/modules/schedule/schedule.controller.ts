import { JsonController, Get, QueryParams, Res } from 'routing-controllers';
import { Response } from 'express';

import { BaseController } from '../base.controller';
import { ScheduleService } from './schedule.service';
import { IGetScheduleDTO } from './schedule.dto';

@JsonController('/schedule')
export class StatusController extends BaseController {
  private readonly scheduleService = new ScheduleService();

  @Get()
  public async get(@QueryParams({ required: true }) query: IGetScheduleDTO, @Res() res: Response) {
    try {
      const schedule = await this.scheduleService.get(query);

      return super.ok(res, schedule);
    } catch (error) {
      return super.error(res, error);
    }
  }
}
