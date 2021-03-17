import { JsonController, Get, QueryParams, Res, Req } from 'routing-controllers';
import { Request, Response } from 'express';

import { BaseController } from '../base.controller';
import { GroupService } from './group.service';

@JsonController('/groups')
export class StatusController extends BaseController {
  private readonly groupService = new GroupService();

  @Get()
  public async get(@Req() _: Request, @Res() res: Response) {
    try {
      const groups = await this.groupService.getAll();

      return super.ok(res, groups);
    } catch (error) {
      return super.error(res, error);
    }
  }

  @Get('/names')
  public async getNames(@QueryParams({ required: true }) query: any, @Res() res: Response) {
    try {
      const groups = await this.groupService.getGroupsNamesFromAPI();

      return super.ok(res, groups);
    } catch (error) {
      return super.error(res, error);
    }
  }
}
