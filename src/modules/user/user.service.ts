import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { NotFoundError, BadRequestError } from 'routing-controllers';

import { GroupService } from '../group/group.service';
import { User } from './user.entity';
import { ICreateUserDTO, IUpdateUserDTO } from './user.dto';

export class UserService {
  private userRepository = getRepository(User);
  private groupService = new GroupService();

  public getOne(chatId: number): Promise<any> {
    const user = this.getByChatId(chatId);
    if (user) throw new NotFoundError('user');

    return user;
  }

  public async create(dto: ICreateUserDTO): Promise<User> {
    const [group, user] = await Promise.all([this.groupService.getOneByName(dto.group), this.getByChatId(dto.chatId)]);
    if (user) throw new BadRequestError('user');
    if (dto.group && !group) throw new NotFoundError('group');

    const instance = new User();
    instance.chatId = dto.chatId;
    instance.group = group || null;
    instance.firstName = dto.firstName;
    instance.username = dto.username;
    instance.type = dto.type;

    const errors = await validate(instance);
    if (errors.length) throw new BadRequestError('group');

    await instance.save();

    return instance;
  }

  public async update(chatId: number, dto: IUpdateUserDTO): Promise<User> {
    if (!dto.group) throw new BadRequestError('group');

    const group = await this.groupService.getOneByName(dto.group);
    if (!group) throw new NotFoundError('group');

    const user = await this.getByChatId(chatId);
    if (!user) throw new NotFoundError('user');

    user.group = group;
    user.firstName = dto.firstName || user.firstName;
    user.username = dto.username || user.username;

    const errors = await validate(user);
    if (errors.length) throw new BadRequestError('group');

    await user.save();

    return user;
  }

  public async remove(chatId: number): Promise<User> {
    const user = await this.userRepository.findOne({ chatId });
    if (!user) throw new NotFoundError('user');

    await user.softRemove();

    return user;
  }

  private getByChatId(chatId: number): Promise<User> {
    return this.userRepository.findOne({ chatId }, { relations: ['group'] });
  }
}
