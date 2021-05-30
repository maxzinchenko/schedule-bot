import { Body, Delete, Get, JsonController, Param, Post, Put, Res } from 'routing-controllers';
import { Response } from 'express';

import { BaseController } from '../base.controller';
import { ICreateUserDTO, IUpdateUserDTO } from './user.dto';
import { UserService } from './user.service';

@JsonController('/users')
export class UserController extends BaseController {
  private userService = new UserService();

  @Get()
  public async getAll(@Res() res) {
    try {
      const user = await this.userService.getAll();

      return super.ok(res, user);
    } catch (error) {
      return super.error(res, error);
    }
  }

  @Get('/:chatId')
  public async get(@Param('chatId') chatId: string, @Res() res) {
    try {
      const user = await this.userService.get(chatId);

      return super.ok(res, user);
    } catch (error) {
      return super.error(res, error);
    }
  }

  @Post()
  public async create(@Body() body: ICreateUserDTO, @Res() res: Response) {
    try {
      const user = await this.userService.create(body);

      return super.created(res, user);
    } catch (error) {
      console.log(error);
      return super.error(res, error);
    }
  }

  @Put('/:chatId')
  public async update(@Param('chatId') chatId: string, @Body() body: IUpdateUserDTO, @Res() res: Response) {
    try {
      const user = await this.userService.update(chatId, body);

      return super.ok(res, user);
    } catch (error) {
      return super.error(res, error);
    }
  }

  @Delete('/:chatId')
  public async remove(@Param('chatId') chatId: string, @Res() res: Response) {
    try {
      const user = await this.userService.remove(chatId);

      return super.ok(res, user);
    } catch (error) {
      return super.error(res, error);
    }
  }
}
