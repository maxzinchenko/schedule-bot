import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { NotFoundError, BadRequestError } from 'routing-controllers';

import { USER_INVALID, USER_NOT_FOUND, GROUP_NOT_FOUND, GROUP_INVALID } from '../../constants';
import { GroupService } from '../group/group.service';
import { User } from './user.entity';
import { ICreateUserDTO, IUpdateUserDTO } from './user.dto';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { Group } from '../group/group.entity';

export class UserService {
  private userRepository = getRepository(User);
  private groupService = new GroupService();

  public async get(chatId: string): Promise<User> {
    const user = await this.getByChatId(chatId);
    if (!user) throw new NotFoundError(USER_NOT_FOUND);

    return user;
  }

  public async create(dto: ICreateUserDTO): Promise<Group> {
    const [group, user] = await Promise.all([this.groupService.getOneByName(dto.group), this.getByChatId(dto.chatId.toString(), { withDeleted: true })]);
    // removing if it's soft deleted
    if (user?.deletedAt) await user.remove();
    if (user && !user.deletedAt) throw new BadRequestError(USER_INVALID);
    if (dto.group && !group) throw new NotFoundError(GROUP_NOT_FOUND);

    const instance = new User();
    instance.chatId = dto.chatId.toString();
    instance.group = group || null;
    instance.firstName = dto.firstName;
    instance.username = dto.username;
    instance.type = dto.type;

    const errors = await validate(instance);
    if (errors.length) throw new BadRequestError(errors[0].property);

    await instance.save();

    return group;
  }

  public async update(chatId: string, dto: IUpdateUserDTO): Promise<Group> {
    if (!dto.group) throw new BadRequestError(GROUP_INVALID);

    const [group, user] = await Promise.all([this.groupService.getOneByName(dto.group), this.getByChatId(chatId)]);
    if (!user) throw new NotFoundError(USER_NOT_FOUND);
    if (!group) throw new NotFoundError(GROUP_NOT_FOUND);

    user.group = group;
    user.firstName = dto.firstName || user.firstName;
    user.username = dto.username || user.username;

    const errors = await validate(user);
    if (errors.length) throw new BadRequestError(errors[0].property);

    await user.save();

    return group;
  }

  public async remove(chatId: string): Promise<User> {
    // using userRepository instead of getByChatId because this call
    // no need to have included models inside user
    const user = await this.userRepository.findOne({ chatId });
    if (!user) throw new NotFoundError(USER_NOT_FOUND);

    await user.softRemove();

    return user;
  }

  // PRIVATE

  private async getByChatId(chatId: string, options?: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne({ chatId }, { ...options, relations: ['group'] });
  }
}
