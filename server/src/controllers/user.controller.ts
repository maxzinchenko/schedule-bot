import { Body, Delete, Get, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers';
import { Response } from 'express';

import { ICreateUserDTO, IUpdateUserDTO } from '../typedef';
import { BaseController } from './index';
import { UserService } from '../services';

@JsonController('/users')
export class UserController extends BaseController {
  private userService = new UserService();

  @Get('/:chatId')
  public async get(@Param('chatId') chatId: string, @Res() res) {
    try {
      const user = await this.userService.getByChatId(chatId);
      if (!user) return super.notFound(res);

      return super.ok(res, user);
    } catch (error) {
      return super.fail(res, error);
    }
  }

  @Post()
  public async create(@Body() body: ICreateUserDTO, @Res() res: Response) {
    try {
      const user = await this.userService.create(body);

      return super.created(res, user);
    } catch (error) {
      return super.fail(res, error);
    }
  }

  @Put('/:chatId')
  public async update(@Param('chatId') chatId: string, @Body() body: IUpdateUserDTO, @Res() res: Response) {
    try {
      const user = await this.userService.update(chatId, body);
      if (!user) return super.notFound(res);

      return super.ok(res, user);
    } catch (error) {
      return super.fail(res, error);
    }
  }

  @Delete('/:chatId')
  public async remove(@Param('chatId') chatId: string, @Res() res: Response) {
    try {
      const user = await this.userService.remove(chatId);
      if (!user) return super.notFound(res);

      return super.ok(res, user);
    } catch (error) {
      return super.fail(res, error);
    }
  }
}
