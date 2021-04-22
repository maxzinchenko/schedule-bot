import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { NotFoundError, BadRequestError } from 'routing-controllers';

import { USER_NOT_REGISTERED, GROUP_NOT_FOUND, GROUP_INVALID } from '../../constants';
import { GroupService } from '../group/group.service';
import { User } from './user.entity';
import { ICreateUserDTO, IUpdateUserDTO } from './user.dto';

export class UserService {
  private userRepository = getRepository(User);
  private groupService = new GroupService();

  public get(chatId: string): Promise<User | null> {
    return this.getByChatId(chatId);
  }

  public async create(dto: ICreateUserDTO): Promise<User> {
    const [group, user] = await Promise.all([this.groupService.getOneByName(dto.group), this.getByChatId(dto.chatId)]);
    if (user) throw new BadRequestError(USER_NOT_REGISTERED);
    if (dto.group && !group) throw new NotFoundError(GROUP_NOT_FOUND);

    const instance = new User();
    instance.chatId = dto.chatId;
    instance.group = group || null;
    instance.firstName = dto.firstName;
    instance.username = dto.username;
    instance.type = dto.type;

    const errors = await validate(instance);
    if (errors.length) throw new BadRequestError(errors[0].property);

    await instance.save();

    return instance;
  }

  public async update(chatId: string, dto: IUpdateUserDTO): Promise<User> {
    if (!dto.group) throw new BadRequestError(GROUP_INVALID);

    const [group, user] = await Promise.all([this.groupService.getOneByName(dto.group), this.getByChatId(chatId)]);
    if (!user) throw new BadRequestError(USER_NOT_REGISTERED);
    if (!group) throw new NotFoundError(GROUP_NOT_FOUND);

    user.group = group;
    user.firstName = dto.firstName || user.firstName;
    user.username = dto.username || user.username;

    const errors = await validate(user);
    if (errors.length) throw new BadRequestError(errors[0].property);

    await user.save();

    return user;
  }

  public async remove(id: string): Promise<User> {
    const chatId = parseInt(id);

    // using userRepository instead of getByChatId because this call
    // doesn't need to have included models inside user
    const user = await this.userRepository.findOne({ chatId });
    if (!user) throw new BadRequestError(USER_NOT_REGISTERED);

    await user.softRemove();

    return user;
  }

  // PRIVATE

  private getByChatId(id: string | number): Promise<User> {
    const chatId = typeof id === 'string' ? parseInt(id) : id;

    return this.userRepository.findOne({ chatId }, { relations: ['group'] });
  }
}
